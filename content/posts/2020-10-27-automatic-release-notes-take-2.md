---
layout: post
title: Automatic release notes on Azure DevOps - an update
date: 2020-10-27T00:00:00.000Z
comments: true
sharing: true
categories:
  - DevOps
description: >-
  6 months ago I posted about how to generate release notes based on a good development process.
  Since then, I was able to make the automatic release notes generation even better. In this post, I will show you how.
published: true
---

6 months ago I posted about [Automatic release notes on Azure DevOps]({{ site.baseurl }}{% link _posts/2020-04-02-automatic-release-notes-azure-devops.md %}). Since then, I was able to make the process a little more centric to Pull Requests and avoid the occasional incorrect work item showing up in the release notes.

The primary difference is that we will use the new [Cross Platform Generate Release Notes](https://github.com/rfennell/AzurePipelines/wiki/GenerateReleaseNotes---Node-based-Cross-Platform-Task) task instead of the original Powershell based task. This updated version offers a little more control via handlebars extensions that can help us filter out the undesired work items. Here is how the task looks like:

![Release Notes Task]({{site.baseurl}}/images/posts/azure-devops-release-notes-new.png)

Note that the template is different from before. We use a custom handlebars function that returns a list of work items:

<script src="https://gist.github.com/jlucaspains/a1c52a02748541f4c7794c3bb8c3b714.js"></script>

The handlebars function iterates through the whole list of work items exposed by the release notes task and filter out items that are assigned to open PRs, in other words, PRs with status different from 3.

<script src="https://gist.github.com/jlucaspains/8e7d27c70f702aeef74986c889963eb4.js"></script>

You could go a little further. If you have multiple target branches for your PRs, you could filter only those that are relevant to a particular release environment. Additionally, you could use any other information in the work items or PR can be used to further customize your release notes. It is really up to your needs.

I'm not trying to justify my laziness (or am I?), but I think that every developer and every DevOps engineer should be a little lazy. That's where we start automating things and life gets much better!

Cheers,
Lucas