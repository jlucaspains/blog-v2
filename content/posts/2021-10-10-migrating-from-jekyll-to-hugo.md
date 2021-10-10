---
layout: post
title: "Migrating from jekyll to Hugo"
date: 2021-10-10
categories:
  - blog
description: >-
  Jekyll is great, but I don't love how hard it is to set it up in windows. For the most part I wrote blog posts blind. I've looked for alternatives and settled on Hugo. This is post is about everything that happened during the Jekyll to Hugo conversion.
cover:
    image: "/images/posts/hugo-logo-wide.png"
    alt: "Hugo"
    caption: "Hugo"
---

So, the first obvious question is: what's wrong with Jekyll?

Overall, Jekyll is fine. I just never liked how hard it is to install it on Windows. For the most part, I made most of my blog changes blindly. That includes structure, style, and blog posts.

The next big question is: why Hugo?

Well... It is super easy to install for one. But it is also popular, easy to use, and works similarly to Jekyll. You can read a more detailed comparison at [forestry.io](https://forestry.io/blog/hugo-and-jekyll-compared/).

I've been toying with the idea of moving to Hugo for at least 1 year now. Once I finally started the conversion, I just couldn't stop. Hugo provides so much out of the box, and contrary to what most comparisons say, the learning curve was not steep at all. In my experience, Hugo is as easy and intuitive as Jekyll. Also, the documentation for Hugo is much better.

To be honest, I didn't really plan the upgrade. I just started doing it and so I started over a few times before I was happy with the result. Let me detail some more the steps I took.

## 1. Install Hugo
Again, super easy. I used [Chocolatey](https://chocolatey.org/) to do this, but the instructions at [gohugo.io](https://gohugo.io/getting-started/installing/) to download and install are clear enough.

## 2. Create an empty site
```
hugo new site blog -f yml
cd blog
git init
```

## 3. Pick a theme
This was by far the hardest part for me. I had already decided to not port my current theme to hugo, but finding one that I liked and had the features I had before took some time. The ones I like the most were [Hyde](https://themes.gohugo.io/themes/hyde/) which is a port from Jekyll themes, [PaperMod](https://themes.gohugo.io/themes/hugo-papermod/), and [Coder](https://themes.gohugo.io/themes/hugo-coder/). Hyde was very similar to my blog's theme, but offered very few features. In the end PaperMod was the one I liked the most because of its many features.

```
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod --depth=1
```

## 4. Adjust theme as needed
For the most part, the theme works for me. I just wanted to do some minor customization. To that end, Hugo provides a very nice approach to replace theme content. You just have to create the same file in a similar structure outside of the themes folder and Hugo will use that files instead of the theme's.

The 3 changes I wanted were:

1. Remove the Description from each post body
2. Show Description from front matter instead of auto-generated Summary in the post list
3. Reduce the gutter size from all pages 

The first two changes were done by copying the single.html and list.html files from the ``themes\Papermod\layouts\_default`` folder into ``layouts\_default`` and modifying the content to show what I wanted. Very simply changes so far.

The third change can be done by creating a folder called ``assets\css\extended`` and creating a custom file there with the gutter change. Since Papermod uses variables, this was extra easy as I only changed the value of ``--max-width`` property:

```css
:root {
    --main-width: 1024px;
}
```

## 5. Move posts from Jekyll to Hugo
I had to review each file because there a few changes to consider here. The very first thing to do is to validate and modify the front matter as needed. Mine mostly worked, I only had to add the ``cover`` section to all posts:

```yml
layout: post
title: "Environment per PR the old fashioned way"
date: 2021-09-23
categories:
  - DevOps
description: >-
  If you cannot or will not use containers but still want to have environment per PR, you can still do it with VMs and IIS. I will show you how.
cover:
    image: "/images/posts/code.jpg"
    alt: "Code"
    caption: "Image by Luca Bravo on Unsplash"
```

I've been using a lot of gists in my posts. With Jekyll, you need to drop the script tag in the post, with Hugo, you need to use a special notation:

```
{{< gist jlucaspains e8c05c31501be81302c766b7de185652 >}}
```

## 6. Move and review other pages
Move your .md files under content folder and check the built result. I only have two extra pages and they both worked without changes at all.

## 7. Hosting
I've hosted my blog in github pages since the beginning. It is super convenient and the native support for Jekyll sites is sweet. This is one big difference between Jekyll and Hugo. Hugo is not supported in the same way by github pages. That shouldn't be a big problem though, you can pre-build the site with ``hugo`` command and publish the files generated. Alternatively, you can use a github workflow to do the same. See [Hugo documentation](https://gohugo.io/hosting-and-deployment/hosting-on-github/) for using github workflow.

A few lessons learned here:

* Publish your Hugo website to a folder called ``docs``. Github only accepts the root of the repo or ``docs` folder. This will allow you to keep the site code and published result in the same repo.
* Don't forget to create a .nojekyll file at the root of the ``docs`` folder to tell GitHub that Jekyll compilation is not needed.
* By default, css and js references in the generate sites are made using absolute URLs. If your site is a sub-directory of the domain (i.e. https://jlucaspains.github.io/blog-v2/) it will not load your css and js correctly. You can fix this by setting the ``relativeURLs: true`` in your site configuration file. Also, you may need to adjust internal links manually.

## 8. Comments
I have disabled comments on my blog a long time ago now. The primary reason was because Disqus added many ads to its platform which annoyed me greatly. In case you don't know, I absolutely loathe ads and so I don't put them in my personal work such as my Blog and [Sharp Cooking](http://sharpcooking.net/) app.

It is finally time to try again. This time, I am using [Utterances](https://utteranc.es/). I have only one word for Uterrances. Wow. It works well, looks good, and was the easiest thing to setup.

## Final thoughts
Hugo was much easier to pick up than I though it would be. I'm very happy with the final result and I had a lot of fun doing it.

Cheers,
Lucas