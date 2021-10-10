---
layout: post
title: "A better approach for auth"
date: 2016-06-18
comments: true
sharing: true
categories:
  - auth
description: >-
  I've seen way too many applications using Role Based Authentication where the code check if user is Admin. This is not a good practice at all. Here is a better way.
---

## Overview
For a change, this is going to be mostly a conceptual post. This also sets ground for the subject in the next few security related post.

Currently there are several options for user authentication but I feel that app authorization is lagging behind. Most people (devs, analysts and biz) usually just go with the default role-based authorization which is flawed in at least a couple ways. In this post I will expose a better approach.

## The "default" way
Normally, auth is seen like this:

  * Authentication: Identify the user; User name + Password, maybe OAuth or perhaps Windows Authentication for intranet environments.
  * Authorization: Check whether the user has access to a role in order to allow access to features in the app.

The problem with this approach (for authorization) is that applications change and so does the security requirements needed for them. The Admin role that performs n tasks today may change and perform n+1 tasks later or perhaps may be broken down into multiple roles. When that happens, role-based security systems will have to change. Simple as that.

Also, this approach is not very granular. It can lead to several ''or'' conditions when checking for permissions:

  * if user is in role 1
  * or in role 2
  * or in role 3
  * and not in role 4
  * then perform action 

## The better approach
The key to make this more granular and configurable is to change the question ''Is the user **a** in role **x**'' to ''Does the user **a** have access to action **x** in resource **y**''. By doing this, we are now able to totally decouple from the role-based authorization to resource-based authorization which by the way is highly compatible with claims-based security. Great, right?

## How to setup the metadata
Let's look at it from an entity relation standpoint:

  * Resource = anything that will be protected by authorization
  * Action = Read, Write, Delete or Execute (can be aggregated)
  * Role = Named group of users
  * Membership = Role + User relation
  * Permission = Role + Resource + Action relation

By using above relations, one can expand all permissions a user has.

## Show me some code!

I'm not going to go too deep in code detailing now cus that's the objective of next post. However, check below examples on how you actually check for permissions in this resource-based authorization.

{{< gist jlucaspains c27e3be8d71804c5cc657ab3d0dab730 >}}

Note that in above examples, there is no check for a role, only whether the current user has ''Read'' access to resource ''App.ResourceName''. Roles are only a means to facilitate grouping users with similar access.

## Ok, what are the drawbacks?
As far as I can tell there is only one real drawback. It can be a little tricky to get your head around this concept. Although, the benefits become obvious really soon.


Next: [Resource/Claims based security in ASP.Net MVC and Web Api]({{ site.baseurl }}{% link _posts/2016-10-20-MVC-with-WIF-and-claims-security.md %})