---
layout: post
draft: true
title: "Rewriting SharpCooking from Xamarin to PWA - Part 1"
date: 2022-11-15
categories:
  - vue
  - xamarin
  - series
description: >-
  TBD
cover:
    image: "/images/posts/sharp-cooking.png"
    alt: "Rating Editor"
    caption: "Rating Editor"
---

This is going to be a series of posts about Sharp Cooking rewrite journey. I'm not sure yet how many parts it will take. In any case, part 1 is about the why and the high level how.

## A bit of history
When I'm not coding I spend a lot of time in the kitchen. Cooking and baking have been a long time passion of mine and I have dozens of recipes I've tweaked over the years. However, I've never found a good recipe book app to maintain my recipes. Thus, back in 2019 I created my own iOS and Android app and called it Sharp Cooking. The goal of Sharp Cooking is very simple: provide a simple yet attractive experience to users without ads or limits. The app is a work of love not money. If you haven't seen the app at all, you can check it on Google and Apple stores:

[![Get it on Google Play](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png)](https://play.google.com/store/apps/details?id=com.lpains.sharpcooking&hl=en_US&gl=US)[![Get it on Apple Store](https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1595980800&h=3172b411dd7e49277ab91073d4be8bf2)](https://apps.apple.com/us/app/sharp-cooking/id1522623942?itsct=apps_box_badge&amp;itscg=30200)

## Why rewrite?
The primary reason for this change is licensing cost. It costs 100 USD per year to keep the app published. Since there is no revenue from the app now or in the near future plan, this is a cost I have to pay myself. It is honestly not a high cost, it just strikes me wrong that I'm doing everything for free while Apple keeps charging me to keep the up published.

## Can a web app replace a mobile app?
A web app can look like a native app and even leverage some device capabilities, but it cannot do everything a mobile app can. Additionally, web apps run within a browser sandbox that is even more restricted than a mobile app. All that said, Sharp Cooking is a simple app. It only needs access to the camera, media files, and a database. Luckily, all of that is possible with a web app.

Another highly desirable feature is the ability to install the app (or add to home) and offline execution. While a well designed web app plus browser cache may give the ability to run offline, installing the app is not possible. At least it was not until [Progressive Web Apps (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) surged and Google and Apple implemented the install and add to home PWA features in their platforms.

## Open source
Sharp Cooking is a closed-source app. 

## 1. vue frontend and PWA
why not svelte?

## Open source

## Hosting

## CI/CD

## How to store the data