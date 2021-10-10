---
layout: post
title: "FreshMVVM master/detail page lazy loaded"
date: 2018-7-29
comments: true
sharing: true
categories: [xamarin-forms, util]
description: Custom implementation of a lazy loaded master/detail page for FreshMVVM framework. Working coding sample included.
---

Out of the box, FreshMVVM offers a Master/Detail page navigation container that works nicely. However, it does not support lazy loading the pages as you navigate to them. Below, I demonstrate how I've done it.

We need to replace the [FreshMVVM original implementation](https://github.com/rid00z/FreshMvvm/blob/master/src/FreshMvvm/NavigationContainers/FreshMasterDetailNavigationContainer.cs) of `FreshMasterDetailNavigationContainer`. Note that the implementation below is mostly a copy  with the following changes:

* The list view is grouped
* Each item in the list can have an icon
* In the AddPage methods, we no longer create an instance of the pages added, we just add a light reference to a collection
* The menu page is a xaml file instead of fully created in code
* Only when the menu item is tapped we instantiate and display the Page and ViewModel

LazyLoadedPage class:

<script src="https://gist.github.com/jlucaspains/2e564f2c021f82def8f107f6cd2a792f.js"></script>

INavigationContainer implementation:

<script src="https://gist.github.com/jlucaspains/e799b2b019e654b2a59e01474928152a.js"></script>

MasterPage.xaml:

<script src="https://gist.github.com/jlucaspains/f6ef3e9c1aee12db3dabe3ed1924a4a9.js"></script>

Usage:

<script src="https://gist.github.com/jlucaspains/96f01ca53a5afd6d39f0e0513fed881c.js"></script>

Here is how the app looks like on Android:

![Lazy Loaded Master Detail example]({{ site.url }}/images/posts/XamarinAndroidLazyLoadedMasterDetail.png)
*Running Lazy Loaded Master Detail example in Android emulator*

And here is the [code](https://github.com/jlucaspains/BlogSamples/tree/master/Xamarin/LPains.LazyLoadedMasterDetailPage) for this post.

Cheers!