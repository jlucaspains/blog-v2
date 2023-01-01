---
layout: post
title: "Rewriting SharpCooking from Xamarin to PWA - Part 1"
date: 2023-01-01
categories:
  - xamarin
  - iOS
  - android
  - series
description: >-
  I have maintained a personal mobile app written with Xamarin for a few years now and it is time to move it to a PWA. This is the first post in a series to describe the process and reasons
cover:
    image: "/images/posts/sharp-cooking.png"
    alt: "Sharp Cooking"
    caption: "Sharp Cooking"
---

This is going to be a series of posts about Sharp Cooking's rewrite journey. I'm not sure yet how many parts it will take. In any case, part 1 is about the why and the high-level how.

## A bit of history
When I'm not coding I spend a lot of time in the kitchen. Cooking and baking have been a long-time passion of mine and I have dozens of recipes I've tweaked over the years. However, I've never found a good recipe book app to maintain my recipes. Thus, back in 2019 I created my own iOS and Android app and called it Sharp Cooking. The goal of Sharp Cooking is very simple: provide a simple yet attractive experience to users without ads or limits. If you haven't seen the app at all, you can check it on Google and Apple stores:

[![Get it on Google Play](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png)](https://play.google.com/store/apps/details?id=com.lpains.sharpcooking&hl=en_US&gl=US)[![Get it on Apple Store](https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1595980800&h=3172b411dd7e49277ab91073d4be8bf2)](https://apps.apple.com/us/app/sharp-cooking/id1522623942?itsct=apps_box_badge&amp;itscg=30200)

The original app was created using Xamarin. Given how simple the app is and my experience with Xamarin and C#, it was an easy choice. About 95% of the whole code base is shared between iOS and Android. The app uses SQLite as a DB and the camera and media gallery for recipe images.

## The why
The primary reason for this change is licensing costs. It costs 100 USD per year to keep the app published. Since there is no revenue from the app now or in the near future plan, this is a cost I have to pay myself. It is honestly not a high cost, it just strikes me wrong that I'm doing everything for free while Apple keeps charging me to keep the app published. Additionally, the inconsistency of the publishing experience can be infuriating, the same version published twice will typically fail once for some arbitrary reason.

I have been asked multiple times why not add ads or a paid version of the app, which should generate enough revenue to cover the licensing cost. Regarding ads, I loathe ads, they are the worst thing that has ever happened and I will not add that to my work. As for the second, Sharp Cooking was initially a paid app when first published and used to cost USD 0.99. Interestingly, I only had minimal downloads, maybe one or two per week. I found out the hard way that users are more likely to pay for freemium apps (i.e. apps with set limits and ads) than pay upfront. Also, the paid app model requires marketing work which I was not keen to do.

## Alternatives
There is no real alternative that covers the scenarios a store mobile app can. The closest option possible would be a web app that can look like a native app and even leverage some device capabilities, but it cannot do everything a mobile app can. Additionally, web apps run within a browser sandbox that is even more restricted than a mobile app. All that said, Sharp Cooking is a simple app. It only needs access to the camera, media files, and a database and all of that is now possible in a web app.

Another highly desirable feature is the ability to install the app and offline execution. While a well-designed web app plus a browser cache may give the ability to run offline, installing the app is a much more recent feature. [Progressive Web Apps (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) now supports installation in most platforms such as iOS, Android, macOS, Linux, and Windows 10+. While each platform has different limitations and features, converting Sharp Cooking to a PWA should still enhance its reach instead of diminishing it.

## Want to help?
Historically, I kept the code for this type of personal project private. I don't think I have a good reason for that, I just never really expected help. However, I'm changing that now. The new app is open-source and contributions are welcome. If you'd rather copy it and make it yours, sure, that is fine too.

I still have a lot of work to do, but you can see what's going on at [GitHub - sharp-cooking-web](https://github.com/jlucaspains/sharp-cooking-web). I have also made the original Sharp Cooking app public at [GitHub - sharp-cooking](https://github.com/jlucaspains/sharp-cooking).

## Progress so far
All major features provided in the original app are now implemented in the new app. I'm still working on some UX, bug fixes, and documentation, but the app is very close to the 1.0 release.

If you are ok with an early version that may break your recipes, feel free to try it at https://app.sharpcooking.net. For those that already use Sharp Cooking, you can restore a backup and all should be good.

## Next up
I am still working on the app and will write a post to describe how I decided which tools and frameworks I was going to use as I rewrote the app.

Next: Tools and frameworks (coming soon)

Cheers,

Lucas