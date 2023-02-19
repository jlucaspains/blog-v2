---
draft: true
layout: post
title: "Rewriting SharpCooking from Xamarin to PWA - Part 5"
date: 2023-03-05
categories:
  - xamarin
  - iOS
  - android
  - series
description: >-
  This is the fifth post on the rewriting SharpCooking series. Playwright is a fundamental part of the app and we will deep dive into it in this post.
cover:
    image: "/images/posts/sharp-cooking.png"
    alt: "Sharp Cooking"
    caption: "Sharp Cooking"
---

This is the fifth and last post on the series, if you haven't seen the other posts yet, I recommend you read them for added context.

1. [The why and high level how]({{< ref "/posts/2023-01-01-rewriting-sharp-cooking-app-part-1" >}})
2. [The tech stack]({{< ref "/posts/2023-01-15-rewriting-sharp-cooking-app-part-2" >}})
3. [The unplanned API]({{< ref "/posts/2023-01-29-rewriting-sharp-cooking-app-part-3" >}})
4. [The DevOps]({{< ref "/posts/2023-02-19-rewriting-sharp-cooking-app-part-4" >}})

## Playwright notes
* Mock browser-fs-access
* Test target browsers and reasons
* Test timeout on Safari desktop and mobile
  * Browser closed - Test timeout of 30000ms exceeded.
* Tests are slow
* Github agent timeout of 1 hour (double-check)
* Fixing flaky tests
* Create tests specific for a browser