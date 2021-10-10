---
layout: post
title: Xamarin Forms Collection View Multi-Selection Binding
date: 2020-11-01T00:00:00.000Z
comments: true
sharing: true
categories:
  - xamarin-forms
description: >-
  Two way binding on Collection Views has a small quirk that is not immediately obvious. In this post, I will show you how to get it working.
published: true
---

I spent a few too many hours fiddling with Xamarin Form's collection view and multi-selection binding. That was somewhat frustrating so I'm writing a little about it in the hopes that you don't have to deal with the same. 

If you have a view like this:

<script src="https://gist.github.com/jlucaspains/8a4d851167c1303118db83129161fa08.js"></script>

and a View Model like this:

<script src="https://gist.github.com/jlucaspains/7a8e2575e8f4bc5dc81f1a9e24b985b0.js"></script>

You'd expect the binding to work, right? No problems. Well, no. It doesn't. The CollectionView will only bind SelectedItems to collections of ``object``. I don't know why the Xamarin team decided to go that route, but it is a quirk that has wasted too many hours. While the view example above is correct, the View Model should look like this:

<script src="https://gist.github.com/jlucaspains/9edcf4756dbbbd1c67a6ad89d0c59c88.js"></script>

There is some info about this problem [in this GitHub issue](https://github.com/xamarin/Xamarin.Forms/issues/6891#issuecomment-511936153). Also, the quirk is expected to be fixed in .net5 as shown [in this open PR](https://github.com/xamarin/Xamarin.Forms/pull/8323).

Cheers,
Lucas