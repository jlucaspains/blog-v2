---
layout: post
title: "Overriding standard date formatting of axios for post/put/patch"
date: 2020-02-13
comments: true
sharing: true
categories: [util]
description: Working with date and time is very painful. This post demonstrates a simple way to make axios POST/PUT/PATCH requests to automatically send local time instead of UTC to a server.
---

![Working with time]({{ site.url }}/images/posts/Time.png)
*Time is painful - Photo by [Aron Visuals on Unsplash](https://unsplash.com/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Let's start by pointing out the obvious. It is painful to work with dates. No matter the technology, it is just harder than it should be. 

Anyway... I stumbled across one of those annoying date related issues with axios. Just to be fair, the problem is not necessarily an axios problem, I just got to it when using axios. By default, axios will use ``JSON.stringify`` to convert an object to a json. Nothing fancy here. The problem is that when a date object is sent to the server, it will be converted to UTC and one might not necessarily want that.

In reading axios documentation, the recommendation was to provide the [``transformRequest``](https://github.com/axios/axios/tree/a11cdf468303a365a6dc6e84f6dd0e4b3b8fd336#request-config) which allows for complete control of the serialization. While that would certainly work, it is a lot of work to just to handle dates in a different way.

The simpler solution to this is to simply overwrite the toJSON function of the Date prototype. Like so:

<script src="https://gist.github.com/jlucaspains/9fd33002e4673dd100f08f36397745ef.js"></script>

This works because internally, the ``JSON.stringify`` function will call ``toJSON``. Objectively, you could do this to any prototype, although none of the other types are as annoying as ``Date`` to work with.

Cheers,
Lucas
