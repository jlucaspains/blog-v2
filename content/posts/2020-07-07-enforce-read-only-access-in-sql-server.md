---
published: true
layout: post
title: Enforce read only access in SQL Server queries
date: 2020-07-07T00:00:00.000Z
comments: true
sharing: true
categories:
  - SQLServer
  - util
description: >-
  If you run dynamic or configurable SQL queries and you need to ensure that
  writes are denied, this post is for you.
---
![Reports]({{site.baseurl}}/images/posts/dashboard.jpg)
*Dashboard - Photo by [Stephen Dawson on Unsplash](https://unsplash.com/photos/qwtCeJ5cLYs)*

This is not something common, I guess. Imagine with me, will you? You have an app dedicated for reporting. The sole reason you built this app is to allow non-developers, but data savvy people, to create operational reports for LOB applications. How do you ensure that your users will not use this solution to modify data on the fly? Imagine how fun would it be to explain why your reporting solution allow them to modify data to your boss. With me so far?

First thing to do is to ensure that the SQL user have read-only access in the desired DB.

<script src="https://gist.github.com/jlucaspains/d3304df3874b4d7fd3d653f82343c6e4.js"></script>

This should prevent all writes and for most scenarios it will be enough. However, if the report user needs to execute stored procedures, we need to do more. When a user is granted execute on a stored procedure they implicitly get access to the objects within it, including write permissions. One way to prevent writes in this scenario is to use the EXECUTE AS clause in the stored procedure to limit the access granted.

<script src="https://gist.github.com/jlucaspains/f16e1ac2c07a39898515ff1f2ef9f258.js"></script>

One other possible solution, albeit not as elegant as the option above, is to simply start a transaction and roll it back. Any changes will not be applied because of the transaction so it should be a catch all solution.

<script src="https://gist.github.com/jlucaspains/57b62ca299d287d0d33238ae1e2dd32c.js"></script>

Very edgy but fun. Cheers!
