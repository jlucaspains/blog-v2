---
layout: post
title: "MVC with Windows Authentication and WIF"
date: 2016-10-20
comments: true
sharing: true
categories: 
  - DevOps
description: >-
  In this post I will show how to achieve something rather common in corporate intranets: How to integrate Windows Authentication for web applications using MVC, Windows Identity Foundation 4.5 (WIF) and Claims based auth. 
---

## Overview
In the previous post, I proposed a "better" way to handle authentication and authorization in web applications for Enterprise. 

What I'm going to demonstrate in this post is something rather common in corporate intranets: How to integrate Windows Authentication for intranet web applications using MVC,  Windows Identity Foundation 4.5 (WIF) and Claims based auth. 

## WIF 4.5
From [MSDN](https://msdn.microsoft.com/en-us/library/hh291066(v=vs.110).aspx):

> Windows Identity Foundation 4.5 is a set of .NET Framework classes for implementing claims-based identity in your applications.

What the doco above doesn't mention is that it is very painful to use WIF and there is little material out there on how to do it. I'm no specialist by any means, but I've used WIF to some extent and hope to shed some light with this post.  

## Windows Authentication
In enterprise environments it is rather common to have a ERP like SAP or Microsoft Dynamics and a collection (sometimes large collection) of smaller applications to achieve all the digital processing your business needs. Top this with a restrictive firewall and proxy, and Windows Authentication suddenly becomes very attractive.

## Roles
If there is one security concept that is widely misused is the concept of roles. I've seen so many applications that were designed to ask "Is user jdoe in role Admin?". The problem with this question is the fact that over time applications change, simple as that. When a role change, you will have to change the software to support it.

Roles are not a bad thing, on contraire my friend, they are a great way to organize and drive security using business terms and business roles. In fact I would go as far as to say they are essential to a good security setup. What should change is how LOB applications use them. Instead of asking "Is user jdoe in role Admin?", we should ask "Does user jdoe have access to resource App.Page?". As far as the application is concerned, there is no role Admin, it doesn't matter which role grants or revokes the access all that matter is whether the user have access to the resource or not. 

## Claim
Disclaimer: below is an extract of [MSDN](https://msdn.microsoft.com/en-us/library/ee517291.aspx)

A claim is a piece of information used to identity something. It can be a name, e-mail, resource access or anything describing such thing. It is issued and signed by an issuer and you should only trust the claim as much as you trust the issuer itself. WIF represents claims with a Claim type, which has an Issuer property that allows you to find out who issued the claim.

Normally, a claim is issued by a Security Token Service (STS), in this example I will merge the STS functionality with the application in order to make my life easier (yes, I am lazy!).

## Enabling Windows Authentication
Start with creating yourself a brand new ASP.Net 4.5.2 web application, ensure to use the MVC template and select Windows Authentication for Authentication.

![New ASP.Net Web App]({{ site.url }}/images/posts/NewAspNetWebApp.png)
*Creating a new asp.net 4.5.2 project*

If you already have a web application, change the following in the web.config:

{{< gist jlucaspains ad82a2dbfc17a4fe8b88e54508517ea9 >}}

Also, if you a running the website on IIS, don't forget to enable Windows Authentication and disable all other authentication methods.

## The Authentication Manager
After authentication a ClaimsPrincipal object is created with Claims from AD with user name and group membership information out of the box. Most likely these Claims won't be enough for your application authorization. This is where we create ourselves an implementation in order to transform our claims (remove claims or add custom claims). Given we are already relying on the Windows Authentication, we can derive an implementation of ClaimsAuthenticationManager and do the Claim processing.

{{< gist jlucaspains 8c147286e3d501428acf6b3494fa3b55 >}}

## Prevent continuous re-authentication
In above code, there is nothing checking for a session token and preventing re-authentication. Also, we need something to set the MVC Context with the new user. In order to achieve this we will need a HttpHandler:

{{< gist jlucaspains 1427eb538f90ad9cd272b4dde07a55cf >}}

## Wire everything together
So we have a custom authentication manager and a HttpModule, all we  need to enable them is to change our web.config 

{{< gist jlucaspains 87a9b0f6b6ff871ed61e1d69e341e93f >}}

## Checking for permissions Server Side
The default ResourceAttribute uses Role to authorize an action, let's improve upon that and create a custom ClaimAuthorizeAttribute. This will allow us to decorate a controller action and assert the user has a specific claim before proceeding.

{{< gist jlucaspains 1ed7a05ad751454b6037e4c8622bab26 >}}

Usage:

{{< gist jlucaspains d7c6a8a0be59aae9e0f193e73f1d1aac >}}

## Checking for permissions
In a razor view, the easiest way to give the user a visual indication of access is to hide the resources they don't have access to or disable it:

{{< gist jlucaspains 7631993fd918d185a53ba5e1b22dbb85 >}}

What about "smart" users?, Couldn't they post the data using another tool?

Nope. Even if the user circumvents the UI limitations, the server is also protected and will return a 403 error. Isn't that a sweet perk? 

Hope this was helpful. Thoughts?