---
layout: post
title: "Date input placeholder hack"
date: 2021-02-05
comments: false
sharing: true
categories:
  - util
  - web
description: >-
  The input type date is a very nice control introduced in html5. The problem is that it is very limited at this point and features such as placeholder are not available. Thus, let's hack it!
---

The input type date is a very nice control introduced in HTML5. The problem is that it is very limited at this point and features such as placeholder may not available. Regardless, you may use it successfully if you are willing to make some css adjustments. In this post I will show how to add a placeholder to a date editor using minimal javascript and css. For the demo below I'm using vanilla css and vuejs just because it is so easy to use.

Since the placeholder attribute is not supported yet, we can use the :before pseudo element of the input. However, we only want to show the placeholder if the input is empty and not focused. We can control the empty/not empty via a simple binding that checks the date data property as shown below.

{{< gist jlucaspains 1b6172afb9f734881a2a0d1361cc1fe7 >}}

Most of the magic happens in CSS though:

{{< gist jlucaspains 9e38a97619eeeb479e71cd53c8e51f6a >}}

That's about it. You can see a working demo in [https://jsfiddle.net/cfbpso5v/3](https://jsfiddle.net/cfbpso5v/3)

Cheers, Lucas
