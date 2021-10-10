---
layout: post
title: "Vue router dirty checking before navigation"
date: 2020-01-11
comments: true
sharing: true
categories: [typescript, vue]
description: Ever lost some data because a website didn't ask if you wanted to save your changes? That's frustrating. Learn how to implement dirty checking before navigation using Vue and typescript in this post
---
![Dirty rugby match]({{ site.url }}/images/posts/RugbyIsDirty.jpg)
*This match is dirty - Photo by [Quino Al on Unsplash](https://unsplash.com/@quinoal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Ever filled up a form with a bunch of information and then accidentally navigated away and lost all data? Well, that's frustrating. However, as a developer, it might be tricky to implement such functionality. This post is a practical guide to implementing is dirty checking using Vue, Vue Router and Typescript.

## TL;DR
Code is available on [GitHub](https://github.com/jlucaspains/BlogSamples/tree/master/vue/lpains-isdirty).

## Expected behavior
In a Vue app with Vue Router, when a user modifies data in a form and any navigation to another route occurs, the user should be notified and have the ability to cancel navigation.

![Is Dirty Demo]({{ site.url }}/images/posts/IsDirtyDemo.gif)
*Demo app running*

## FormEdit.vue
I like to wrap this kind of functionality in base components that can be reused across multiple forms. This is specially true for IsDirty and IsBusy. For this demo I created a ``FormEdit`` component.

The `FormEdit` component will be added inside a template to wrap the form controls. It will also request that the entity being edited is passed to it so it can track changes using a ``@Watch``. Finally, it exposes two methods to control is dirty and navigation: ``resetDirty`` will be called anytime the consumer deems the entity to be clean; ``ensureNotDirty`` will be called anytime navigation is detected from its parent component registered as a route in Vue Router. 

<script src="https://gist.github.com/jlucaspains/28d5ff0c88a57ec0d809b1d28f94b565.js"></script>

## Home.vue
This component contains the actual form with a couple of fields. It uses the ``form-edit`` as a wrapper around the form fields as indicated in the previous section. On ``mounted`` we load the data and mark the form as not dirty. This is required because by modifying the entity property the FormEdit thinks the form is dirty. Finally, this component has a hook for ``beforeRouteLeave``. This hook is what we need to intercept and allow or cancel the navigation. The heavy lifting is done by ``FormEdit`` but Vue Router requires that the route component has the hook method meaning that we intercept it here and pass the values on the ``FormEdit``.

<script src="https://gist.github.com/jlucaspains/e978c768184753dd19c9ec59992bc094.js"></script>

## Can we improve this?
Of course! The number one thing you might want to do is to replace the simple dirty tracking with an actual compare of the old/new entity so you  only prompt the user if they have changes pending. Once the user changes the record back, you can disable save button and such.

Got some feedback for me? Hit me up on twitter!

Cheers,
Lucas