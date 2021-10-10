---
layout: post
title: "Simple concurrency tester"
date: 2019-09-06
comments: true
sharing: true
categories: [util]
description: The simplest possible way to perform concurrent testing for API developers.
---

You probably know how hard it is to purposefully cause a concurrency issue so you can test your code in these edge scenarios. I ran into this issue not too long ago and found that my favorite web service tester [Postman](https://www.getpostman.com/) doesn't support sending multiple messages concurrently. I'm sure there are plenty of tools out there that do a great job, but for the simplest possible way you can use a combination of cURL and scripting. Here is an example using Windows, cURL and cmd script.

<script src="https://gist.github.com/jlucaspains/0791fcf0393b4106140a2d484a619cc8.js"></script>

This is very simple. In fact, too simple to handle anything other than debug. But hey, I'm a developer! ;)

Cheers!