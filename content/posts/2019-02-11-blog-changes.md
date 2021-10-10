---
layout: post
title: "Blog Changes"
date: 2019-2-11
comments: true
sharing: true
categories: [blog]
description: A round of improvements for this blog occurred. Commenting have been temporarily disabled due to Disqus new policies and SyntaxHighlighter was also replaced with gist for better code snippets and a faster page load.
---

![Slow blog - improvements needed!]({{ site.url }}/images/posts/slow-blog-before-improvements.jpg)
*This blog is so slow...*

Recently, I run a [GT Metrix](https://gtmetrix.com/) test on my blog and got an abysmal D score. After some investigation I noticed a few things that need improvement:

* Disqus was loading too many things that I really didn't care for. This included ads.
* Many scripts, styles and images were not optimized nor entirely needed.
* No browser caching was implemented

To fix Disqus problem I removed it entirely, I really don't like ads, specially how Disqus introduced them in their free offering. I'm evaluating an alternative option and will reintroduce commenting soon, I hope.

After round of improvements I was able to remove unnecessary scripts, styles, fonts and images. This included replacing SyntaxHighlighter in favor of [Git Hub Gists](https://gist.github.com/jlucaspains) and image compression using [Tiny PNG](https://tinypng.com/). The image compression along saved about 40% in file transfer size.

There were more changes done but I don't feel they made a whole lot of difference just yet. There will be more changes to come too as I find more opportunities.

If you are interested [here is the commit](https://github.com/jlucaspains/blog/commit/9e932115820bd6949571e16bd71e169843266263) with all the changes.

Cheers