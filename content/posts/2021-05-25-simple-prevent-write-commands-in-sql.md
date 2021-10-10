---
published: true
layout: post
date: 2021-05-25
title: "Simple prevent write commands in SQL Server"
sharing: true
categories:
  - util
description: >-
  Some times you just need to check whether a script will try to mess with your DB. In this post, I show you a regex that can help you check for that.
---
On multiple occasions, I found myself trying to check if a query for data read is safe to execute or not. This is typically useful when the query is saved outside of your code, and you cannot restrict the access level of the user executing it.

The following regex, while not exhausting by any means, will detect most query patterns typically used to change data. Note that inserts, updates, deletes, and merges are permitted on temporary tables (e.g.: #tbl or ##tbl) and memory tables (e.g.: @tbl).

{{< gist jlucaspains cf16132d2141acebef1c9ecab92fdd42 >}}

Cheers,
Lucas