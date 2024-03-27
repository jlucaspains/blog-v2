---
layout: post
title: "Sharp Cooking now displays nutrition labels"
date: 2024-03-26
categories:
  - announcement
description: >-
    Sharp Cooking is now 4 years old and to celebrate we added a long waited feature, recipe nutrition labels.
cover:
    image: "/images/posts/recipe-nutrition-label.jpeg"
    alt: "Nutrition Label"
    caption: "Nutrition Label"
---

Sharp Cooking has reached its fourth anniversary! To mark this significant milestone, we're thrilled to introduce a highly anticipated feature: Nutrition Labels. Now, not only can you input nutrition values manually, but recipes imported from websites supporting nutrition values will also display them in the recipe view.

To generate these labels, we first need to gather the nutritional data for each recipe. Fortunately, many websites offer this information, and [recipe-scrapers](https://github.com/hhursev/recipe-scrapers), the python package utilized by Sharp Cooking to extract recipes from the web, already supports it too. Additionally, users can manually input nutrition data on the recipe edit page. Once imported or manually entered, the nutrition data is stored alongside the recipe.

Here's a peek at the code responsible for scraping nutrition data from a web recipe:
```python
from recipe_scrapers import scrape_me

scraper = scrape_me('https://downshiftology.com/recipes/falafel/')
scraper.title()
scraper.image()
scraper.ingredients()
scraper.instructions_list()
scraper.yields()
scraper.nutrients()  # nutrition data
```

With the data in hand, we need to present it effectively. For this purpose, we leverage [vue-nutrition-label](https://github.com/nutritionix/vue-nutrition-label) which offers a pleasing display in addition to calculating the daily percentage values. To better fit sharp-cooking design, we imported the `.vue` file from vue-nutrition-label rather than using its package. The result? A sleek nutrition label that seamlessly integrates with the recipe view's design.

The feature is currently in preview and available to all users who opt in via the Options page. We are continually refining and enabling new capabilities, and your feedback is invaluable to us. Whether you have suggestions or encounter any issues, please don't hesitate to reach out to us on [GitHub](https://github.com/jlucaspains/sharp-cooking-web/issues).

Lastly, we've updated the documentation, which you can find at [sharpcooking.net](https://sharpcooking.net/).

Cheers,\
Lucas