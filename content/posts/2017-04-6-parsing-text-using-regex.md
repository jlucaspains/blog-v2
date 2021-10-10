---
layout: post
title: "Parsing text into typed objects using RegEx named groups"
date: 2017-4-6
comments: true
sharing: true
categories: 
  - util
description: >-
  Using regex to capture and parse text into objects.
---

A little while ago, I had to build a desktop app that received input from devices which I had no control of. Although each implementation had similar requirements, the devices connected to the app were slightly different and so were the inputs received from them. I've looked for other similar implementations and found that some people implemented device specific parsers. Furthermore, they used configuration to select the correct parser. I think there is at least one issue with this approach: any change to the known inputs would require the application to change as well. Maybe there is a better way...

The trick I want to demonstrate relies on named group capturing from Regular Expression and a little fiddling with reflection.

> Note: this technique works great for most scenarios but if you are looking for a super high performance solution, this is not for you.

Alright! Let's see some code.

{{< gist jlucaspains b3c77fbd6da23699a27c0a440738166c >}}

So with above code you can, for instance, parse a string that represents Product and Price into a typed object:

{{< gist jlucaspains 13467c4c875c897743ddb9a91c360917 >}}

I find this most useful when you don't really have control of the input, maybe it is a device input or a legacy system that just drop you some info. Regardless, this can save a bunch of time when the input changes or a new device needs to be supported.

You can find samples [at my github repo](https://github.com/jlucaspains/BlogSamples).

Happy coding!