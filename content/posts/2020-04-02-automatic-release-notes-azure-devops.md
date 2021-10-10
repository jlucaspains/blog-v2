---
layout: post
title: Automatic release notes on Azure DevOps
date: 2020-04-02T00:00:00.000Z
comments: true
sharing: true
categories:
  - DevOps
description: >-
  Release notes are one of those things that we typically leave for last. In
  this post I will show you how to completely forget about it and still get
  great release notes.
published: true
---
If you are neck-deep into DevOps using Azure DevOps, chances are that you have your code on a git repository, have PBIs or Stories, are using Pull requests, Builds, and releases. If you are doing all of this good stuff, great! Carry on and I will show you how to get that shiny cherry on top of your cake. If you are not, you can probably benefit from this post too, but you will have to figure out how to do the same using the tools you love.

What I want to do is to automatically generate a markdown file with all work items associated with this release. I also want to accumulate work between environments so work items will only show once on a particular environment.

## PR
First, ensure you have a solid branching strategy. I'm quite fond of [git flow](https://nvie.com/posts/a-successful-git-branching-model/) myself, but anything that uses a PR will work fine.

I really recommend you use PR policies to ensure that everyone is doing the same. This is what I recommend for most projects:

* Require a minimum number of reviewers:

![PR_number_reviewers.png]({{site.baseurl}}/images/posts/PR_number_reviewers.png)

* Check for linked work items. This is key to ensure that release notes are generated

![PR_workitem.png]({{site.baseurl}}/images/posts/PR_workitem.png)

* Check for comment resolution

![PR_comments.png]({{site.baseurl}}/images/posts/PR_comments.png)

* Merge Type
  * I like squash because it allows the dev to push as many changes as they want but master/develop branch only get a single clean commit

![PR_merge_type.png]({{site.baseurl}}/images/posts/PR_merge_type.png)

* Build

![PR_build.png]({{site.baseurl}}/images/posts/PR_build.png)

## Build
Make sure that your build has the ``Automatically link new work in this build`` flag turned on.

## Release
The release notes are generated at the release (duh!) and they will be different from each environment used. You will need an extension to generate the release notes. I use [this one by Richad Fennel](https://marketplace.visualstudio.com/items?itemName=richardfennellBM.BM-VSTS-XplatGenerateReleaseNotes&targetId=a7a780bd-ad1c-4875-bc30-030f9dba7f75). Below are the configurations that work well for me:

![GenerateReleaseNotes.png]({{site.baseurl}}/images/posts/GenerateReleaseNotes.png)

The template is markdown with some special notation for variables. Review the extension documentation for more information. In my template, I put the work item name and a link back to the azure devops work item. Uncheck the Generate for only this Release flag to ensure that work items associated with builds without releases or not approved releases are accumulated. Here is a copiable version of the template.

<script src="https://gist.github.com/jlucaspains/9560904dd65aae7a74b26a6c5c6e98c0.js"></script>

The final piece of the puzzle involves publishing your release notes. I recommend having an API endpoint in your app where you can post the release notes. Again, I use powershell to do that:

![PublishReleaseNotes.png]({{site.baseurl}}/images/posts/PublishReleaseNotes.png)

And here is the powershell code above:

<script src="https://gist.github.com/jlucaspains/e03a32104697c3be3841beb6f304b199.js"></script>

## Result

Finally, you can render the uploaded markdown into a html page. Here is what your release notes could look like (style was shamelessly stolen from Visual Studio Code release notes):

![ReleaseNotesResult.png]({{site.baseurl}}/images/posts/ReleaseNotesResult.png)

## Done

That was a lot of little things to consider. However, once you have everything setup, you will never have to write release notes again.

Cheers,
Lucas
