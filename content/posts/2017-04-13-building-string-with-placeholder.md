---
layout: post
title: "Building string with placeholders"
date: 2017-04-13
comments: true
sharing: true
categories: 
  - util
description: >-
  Last post I showed a cool way to parse strings into typed objects. In this one, I want to show the opposite. How to build strings using a template and an object.
---

Last post I showed a cool way to parse strings into typed objects. In this one, I want to show the opposite. How to build strings using a template and an object.

The idea is to use a template like `{BirthDate:D} My name is {FirstName} {LastName} and I'm cool.` and an object with properties `BirthDate`, `FirstName` and `LastName` to fill in the placeholder values and apply optional formatting. There are several uses for a utility like this but my favorite use is templated email messages.

Kudos to Scott Hanselman for [this solution](http://www.hanselman.com/blog/PermaLink,guid,2a0fdc2c-6b15-4a46-a802-0ebc0b8662d9.aspx). 

The nice part about this solution is that it won't throw any exceptions if it can't correctly build the string. It will just leave the bad part of the template in the result. Also, it supports Format Providers which also allows for specific culture targeting:

{{< gist jlucaspains 79a72598b13a37b84166a21b430cc813 >}}

You can find the code in [Scott's git hub repo](https://github.com/shanselman/ObjectToString/blob/master/ObjectToString/ObjectToString.cs)

PS: I know that Scott posted about this years ago but I use this so often that I felt like it deserved another blog post...

Happy coding!