---
layout: post
title: "Xamarin Forms Handle Android Key Up event"
date: 2020-03-20
comments: true
sharing: true
categories: [xamarin]
description: Yet another post about date and time. Need to convert a date from a specific time zone in Xamarin Forms? No problem, this post will show you exactly how.
---

![Keyboard]({{ site.url }}/images/posts/Keyboard.jpg)
*Black Keyboard - Photo by [Dries Augustyns on Unsplash](https://unsplash.com/s/photos/android-tablet-keyboard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Devices that are optimized for industrial purposes are typically rugged, have physical keyboards, and are very expensive. Why keyboards, you ask? First, a lot of those devices are still running Windows CE. Second, it is not uncommon for them to be used by workers wearing gloves. This is especially true in cold warehouses. Thus, having to use touch in these scenarios is less than ideal. In this post, I wanted to write about how you can handle keyboard events for an Android app built using Xamarin Forms.

## TL;DR
Sample code is available on [GitHub](https://github.com/jlucaspains/BlogSamples/tree/master/Xamarin/LPains.AndroidGlobalKeyUp).

## Expected behavior
In any view, we want to be able to intercept a keyboard key up event even when the focus is on a text view.

## Writing a Custom renderer
My first try was to write a [Renderer for the ContentPage](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/custom-renderer/contentpage). I subclassed the ContentPage and created a renderer which has the virtual ``OnKeyUp`` method. I followed closely what Daniel Gatto has done on his [blog post](https://dgatto.com/posts/2019/08/xam-hardware-keyboard/). It looked like this:

<script src="https://gist.github.com/jlucaspains/cdc62b3cf0c4366a13705337ee19507b.js"></script>

This approach worked. However, once more components were added to the page, the key up wouldn't trigger if the focus wasn't on the right component. The page itself. That didn't quite cut it for my purposes. I wanted to have enumerated lists and let the user pick items by their number. Additionally, I wanted to allow my users to trigger commands by pressing letters that were not allowed in number inputs.

## Android Activity Key Up
The Android Activity offers a ``OnKeyUp`` virtual method which you can override. This method is called for every key the user presses and let go, including command keys, hardware back key, and even some keys pressed by the virtual keyboard. Bottom line: be careful with what you are doing here. The code would look something like this:

<script src="https://gist.github.com/jlucaspains/e6e22a3f93eb8a062c388940a89464e8.js"></script>

The ``MessagingCenter`` is a nice and simple way to get the events in your view models. However, remember to subscribe as views become visible and active and unsubscribe when they are not. You can do that by using the ``OnAppearing`` and ``OnDisappearing`` view events. Like so:

<script src="https://gist.github.com/jlucaspains/d8b1540d8aaf1adab435bef2c0a6cfbc.js"></script>

## Wrap up
Try using this with those nice ``F`` keys that you never expected an Android device to have!

Cheers,
Lucas
