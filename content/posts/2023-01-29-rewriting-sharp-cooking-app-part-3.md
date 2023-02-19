---
layout: post
title: "Rewriting SharpCooking from Xamarin to PWA - Part 3"
date: 2023-01-29
categories:
  - xamarin
  - iOS
  - android
  - series
description: >-
  This is the third post on the rewriting SharpCooking series. In this post let's talk about the Sharp Cooking API introduced to overcome PWA security challenges.
cover:
    image: "/images/posts/python.jpg"
    alt: "Python"
    caption: "Photo by [David Clode](https://unsplash.com/@davidclode?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/vb-3qEe3rg8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

This is the third post in the series. If you haven't seen the first two posts yet, I recommend you read them for added context.

1. [The why and high level how]({{< ref "/posts/2023-01-01-rewriting-sharp-cooking-app-part-1" >}})
2. [The tech stack]({{< ref "/posts/2023-01-15-rewriting-sharp-cooking-app-part-2" >}})

## The problem
Sharp Cooking allows for recipe extraction from many websites. The original app makes a web request that loads the HTML page and parses the content to identify a recipe. The parsing is done using XPath and a configuration file determining the XPATH queries to be used. The config looked like this:

```json
[{
    "hostname": "www.allrecipes.com",
    "titleXPath": [
        "//h1"
    ],
    "imageXPath": [
        "//meta[@property=\"og:image\"]"
    ],
    "imageAttribute": "content",
    "ingredientsXPath": [
        "//fieldset[@class=\"ingredients-section__fieldset\"]/ul/li",
        "//ul/li[@class=\"checkList__line\"]/label/span[@itemprop=\"recipeIngredient\"]"
    ],
    "preparationXPath": [
        "//fieldset[@class=\"instructions-section__fieldset\"]/ul/li/div[@class=\"section-body\"]",
        "//ol[@itemprop=\"recipeInstructions\"]/li[@class=\"step\"]"
    ]
}]
```

I was forcibly reminded that a Web app running solely on the browser is under higher security limitations. In this context, CORS (Cross Origin Request Sharing) applies when executing fetch requests such as loading a web page. While each website might have different requirements, it is very typical to enforce a same-origin policy that prevents a javascript-based application (from a different origin) from making the fetch request to load HTML content. Therefore, the recipe import feature in the new SPA app was broken. Badly. 

## The unplanned API
This is where I had to break the "no server-side processing" rule mentioned in the first article. I felt like the app would lose too much value if it wasn't able to download recipes from websites and at the same time I wouldn't be able to do that from the app itself. At this point, I introduced a small API that would receive the recipe URL and extract it to a JSON object. Because the API is running as a server app, CORS does not apply to calls initiated in the backend.

When thinking about how to build the API, my initial feeling was to stick with typescript and thus use NodeJS. A second option was to use .NET because, well, that's what I know best. Before deciding how to do the API, however, I did some research on tools that could help extract the recipes. I felt like parsing the page content myself was very limiting because I had to set up every website manually. Besides taking a lot of time, websites change often and my configuration needed constant adjustments.

In recent years, many recipe sites have adopted the [JSON-LD](https://json-ld.org/) format to expose structured information. For someone that had to use XPATH before to grab the information needed, JSON-LD is like a dream. An example recipe in JSON-LD would look like this:

> This is a significantly simplified JSON-LD example yet it is still valid.

```json
<script type="application/ld+json">
[
    {
        "@context": "http://schema.org",
        "@type": [
            "Recipe"
        ],
        "datePublished": "2022-01-01T02:43:07.000-04:00",
        "author": [
            {
                "@type": "Person",
                "name": "John Doe"
            }
        ],
        "image": {
            "@type": "ImageObject",
            "url": "https://lpains.net/image.png",
            "height": 1000,
            "width": 1500
        },
        "name": "Eggplant Parmesan",
        "cookTime": "PT35M",
        "prepTime": "PT25M",
        "recipeIngredient": [
            "1000 grams flour",
            "700 grams water",
            "11 grams salt",
            "4 grams yeast"
        ],
        "recipeInstructions": [
            {
                "@type": "HowToStep",
                "text": "Mix everything"
            },
            {
                "@type": "HowToStep",
                "text": "Bake."
            }
        ],
        "recipeYield": [
            "10"
        ],
        "totalTime": "PT60M",
        "about": []
    }
]
</script>
```

The adoption of JSON-LD is surprisingly high at the time of writing, but as expected, not every website supports it yet. For some websites, I would need to go back to the XPATH approach. I found a great open-source project called [recipe-scrapers](https://github.com/hhursev/recipe-scrapers) that provided scraping capabilities for many websites using a combination of JSON-LD and XPATH. recipe-scrapers is a Python package meaning I would need to build the API in Python.

I initially build the new API using [FastAPI](https://fastapi.tiangolo.com/) and enjoyed using it. But when I published it to Azure as a free tier App Service, I noticed the start time was terribly slow. If I called the API from the app and it had to cold start it could take nearly a whole minute to return. For some of its supported stacks, App Service spins up a container on cold start and has to wait for all required services to start before serving the request. As one can imagine, that is very slow indeed.

The FastAPI version of the API code is publicly available at [sharp-cooking-api](https://github.com/jlucaspains/sharp-cooking-api) repo. 

Next, I tried building the API as an Azure Function and that worked perfectly. In general, requests were back to taking less than a second total.

## Parse recipe
The primary reason for the whole API is to extract recipes from the internet, so a lot of work went into building this endpoint. It will receive a URL and a flag determining whether images should be pre-processed since the app may not be able to download them separately because of CORS.

The parse-recipe API method may be simplified to look like this:

```python
import json

import azure.functions as func

from recipe_scrapers import scrape_me
from pint import UnitRegistry

from ..util import parse_recipe_ingredient, parse_recipe_instruction, parse_recipe_image
from ..models import Recipe

ureg = UnitRegistry()

def main(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    url: str = req_body.get("url")
    downloadImage: bool = req_body.get("downloadImage") or False
    try:
        scraper = scrape_me(url, wild_mode=True)
        
        lang = scraper.language() or "en"
        
        ingredients = map(lambda x: parse_recipe_ingredient(x, lang, ureg), scraper.ingredients())
        instructions = map(lambda x: parse_recipe_instruction(x, lang), scraper.instructions_list())
        
        result = {
            "title": scraper.title(),
            "totalTime": scraper.total_time(),
            "yields": scraper.yields(),
            "ingredients": list(ingredients),
            "steps": list(instructions),
            "image": scraper.image(),
            "host": scraper.host()
        }
        
        if downloadImage:
            image_uri = parse_recipe_image(result["image"])
            result["image"] = image_uri

        return func.HttpResponse(json.dumps(result), status_code=200, mimetype="application/json")
    except Exception as e:
        
        return func.HttpResponse("Could not find a recipe in the web page", status_code=400)
```

You will notice I have a few helper methods to deal with ingredients, instructions, and images. The idea is to build additional smartness into the result. For instance, I have been working towards separating the quantity from the unit of measure and the ingredient:

Given an ingredient line "1 cup flour", I would like to return the following JSON for the ingredient item:

```json
{
  "quantity": 1,
  "unit": "cup",
  "ingredient": "flour"
}
```

Now that we have this broken down, we could easily, albeit not always precisely, convert between US customary and metric systems as an example. With this conversion 1 cup flour ≈ 120 grams flour.

As of now, I'm using a regex to perform this work but I have also tried using a [machine learning model](https://github.com/nytimes/ingredient-phrase-tagger) for that. Again, this is all experimental and the app is not leveraging these smarts yet.

## Process image
In the interest of saving on device space, I would like one last method in the API where local images can be submitted for size reduction. This is especially valuable when uploading Camera Roll images from newer devices. These can be several MB large and the higher quality adds very little to the recipes. Since we already have image reduction logic available in the API, we just need to expose it as a dedicated endpoint.

Below is the helper method that processes images to reduce their size and return them as data URLs. Note the primary method of reducing the size is to set the maximum width and height to 1024.

```python
import io
import base64
import mimetypes
from PIL import Image

def parse_image(name: str, image: bytes, resize: bool = True) -> str:
    mime = mimetypes.MimeTypes().guess_type(name)[0]
    image_open = Image.open(io.BytesIO(image))
    
    format = mime.lower().replace("image/", "")
    
    buffered = io.BytesIO()
    if resize:
        image_open.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        image_open.save(buffered, format=format)
    else:
        image_open.save(buffered, format=format)
        
    return ("data:" +  mime + ";" + "base64," + base64.b64encode(buffered.getvalue()).decode())
```

## Process backup
The original backup file from Sharp Cooking is a `.zip` file containing a JSON with the recipes and the images related to the recipes. While we could easily handle a `.zip` in the SPA app using something like [JSZip](https://stuk.github.io/jszip/), the original backup files were rather large because of uncompressed images.

This is another scenario where leveraging the API makes sense so I have created an endpoint to parse the original zip backup. Note that the new app creates backups in JSON format so this API is only used when restoring zip backup files.

## That's all folks
Long story short: CORS prevented me from scraping web pages directly from the SPA app so I created an API. Because of available tooling (gazing lovingly at recipe-scraper project), Python was used instead of .NET or NodeJS. Since we are building an API anyway, we will also build some nice capabilities such as ingredient and instruction parsing and image size reduction. For better performance, we will leverage Azure Functions as the API platform.

As always, feel free to check the progress, log issues, or contribute in the [GitHub repo](https://github.com/jlucaspains/sharp-cooking-web).

Next: [The Devops]({{< ref "/posts/2023-02-19-rewriting-sharp-cooking-app-part-4" >}})