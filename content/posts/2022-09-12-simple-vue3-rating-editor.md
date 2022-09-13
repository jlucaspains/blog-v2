---
layout: post
title: "The simplest Vue 3 Rating Editor"
date: 2022-09-12
categories:
  - vue
description: >-
  I have built the simplest possible rating editor in Vue 3 composition API an this is how I've done it.
cover:
    image: "/images/posts/RatingEditor.gif"
    alt: "Rating Editor"
    caption: "Rating Editor"
---

This is going to be short and sweet. I have built the simplest possible rating editor in Vue 3 composition API an this is how I've done it.

{{< gist jlucaspains d409d7a3590d368f422425a748cca0dd >}}

A couple of details worth noting:
1. Each star is a clickable button
2. The star is an emoji
2. Because the emoji comes with color, we apply a class ``gray`` to apply a ``grayscale`` filter when value is less than the current star
3. Upon a star button click, we update the ``modelValue`` to the corresponding value which renders the stars again

That's it. Have fun!

Cheers,

Lucas