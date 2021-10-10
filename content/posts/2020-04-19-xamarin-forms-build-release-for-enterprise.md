---
layout: post
title: Xamarin Forms Azure DevOps build/release for Enterprise apps
date: 2020-04-19
comments: true
sharing: true
categories:
  - DevOps
  - Xamarin
description: >-
  Having a reliable pipeline that builds your Xamarin Forms apps in multiple configurations is beautiful. In this post, I will show you how to create a yml pipeline to build your iOS and Android app and release it to your Enterprise users.  
---

![Building blocks]({{ site.url }}/images/posts/build-lego.jpg)
*Building Blocks - Photo by [Markus Spiske on Unsplash](https://unsplash.com/photos/C0koz3G1I4I)*

In January last year, I wrote about [building and deploying Xamarin iOS apps using Azure DevOps]({{ site.baseurl }}{% link _posts/2019-1-31-build-deploy-xamarin-ios-azure-devops.md %}). I wanted to write about the Android process but never mustered the energy to do it. Nevertheless, today is the day I will.

Not a ton has changed since then. Perhaps, the most relevant change is that last time I showed how to deploy directly to the store and this time I want to show how to deploy as an Enterprise app. Also, the build will use the somewhat new yml build pipeline instead of the visual build.

Enough said, let's get to it.

## Requirements
* Since not much changed, check [the original post]({{ site.baseurl }}{% link _posts/2019-1-31-build-deploy-xamarin-ios-azure-devops.md %})) for the iOS requirements.
* For Android, you need to create a keystore file to sign the apk. Follow instructions in [this document](https://docs.microsoft.com/en-us/xamarin/android/deploy-test/signing/?tabs=windows) to do it.
* A website to publish the apk/ipa and any other necessary resources for distribution.

## The Build

I broke the build pipeline in 2 jobs: iOS and Android. Furthermore, each job will build a QA version and a PRD version of the app. Building multiple versions is useful because you can change labels and icons during the build and prevent that special user from testing in PRD. Keep in mind that the cost of building multiple versions will be paid with a more complex pipeline and the risk of slight differences due to build time configuration that can cause issues in one environment but not the other.

Here is a heavily annotated build yml file:

<script src="https://gist.github.com/jlucaspains/3d27de10db0e99d7b7593dcb8323cf55.js"></script>

## The Release
There are a few ways to release an enterprise app, however, I'm most familiar with distribution through download from a website, so I will discuss that.

As usual, Android is easy. When the user lands on your website provide them a button/link to download the apk and they can open it to install after download completes. Note that the user will only be allowed to install the app if [they enable install from unknown sources](https://www.androidcentral.com/unknown-sources).

```html

<a href="https://lpains.net/content/com.lpains.mobile.apk">
  Download my awesome Android app
</a>
```

For iOS, the user need to click on a special link that points to the plist file created during the build. If everything checks, iOS will offer to install the app. After installation, the user will need to [trust the enterprise developer](https://support.apple.com/en-us/HT204460) before the app can be used.

```html

<a href="itms-services://?action=download-manifest&url=https://lpains.net/content/com.lpains.mobile.plist">
  Download my awesome iOS app
</a>
```

Android or iOS, it is very important that the user initiates the install action by interacting with your website. Do not redirect the user to the install links as that will fail due to security reasons.

Unfortunately, there is not much material out there on how to build a Xamarin Forms app for both iOS and Android. This post is mostly a bunch of notes I took while getting everything working for an app I build for work. Anyway, hope it helps.

Cheers,
Lucas
