---
layout: post
title: "Xamarin Forms converting from one timezone to another"
date: 2020-03-16
comments: true
sharing: true
categories: [xamarin, util]
description: Yet another post about date and time. Need to convert a date from a specific time zone in Xamarin Forms? No problem, this post will show you exactly how.
---

![Timezones]({{ site.url }}/images/posts/Timezones.jpg)
*Timezones - Photo by [Nasa](https://unsplash.com/@nasa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

There is a pattern here, I think. I don't like to work with dates and you probably know that by now. Anyway, don't like them, got to work with them. In this episode of Pains against dates, I wanted to write about something very specific that I had the pleasure to troubleshoot last week.

I have this very important and somewhat old app where all dates are saved using server local time. I don't recommend doing that BTW. I prefer to save dates in UTC except those where the timezone is irrelevant like Production Date (fixed point in time and location). Using Xamarin, I wanted to show a date that was saved in CST in the phone's timezone. The ``TimeZoneInfo`` class should make this easy, but timezone IDs are different between Android and iOS and I found that out the developer way: Exceptions!

If you get a ``TimeZoneNotFoundException`` chances are that the timezone id is incorrect. The timezone id used by ``TimeZoneInfo`` class is different for each device platform. Here is a subset of timezone ids for [Android](https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r33/packages/SettingsLib/res/xml/timezones.xml) and [iOS](https://gist.github.com/mteece/80fff3329074cf90d7991e55f4fc8de4).

Code example that demonstrates the difference:

<script src="https://gist.github.com/jlucaspains/33f6513aea65d33a87e1592db97309c1.js"></script>

Fun, right?

Cheers,
Lucas
