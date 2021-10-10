---
layout: post
title: "TFVC to git import alternative"
date: 2019-2-13
comments: true
sharing: true
categories: [VSTS, git]
description: Previously, I've shown how to import source from TFVC to git using git-tfs tool. There is another way to do it right in Azure DevOps and I show it here.
---

On [Migrating from TFS + TFVC to VSTS + git]({{ site.baseurl }}{% link _posts/2018-7-15-migrating-from-tfs-to-vsts-git.md %}) post I showed how to export your TFVC repository, or a part of it, to a git repository using [git-tfs](http://git-tfs.com/) tool. Today, I found an alternative totally by chance and it might be just what you needed to finally move to git.

TFS 2018 and Azure DevOps offers an option called _Import Repository_ located at Code  in TFS or Repos Azure DevOps. This option will import or create a git repository from another host such as github or a local TFVC repository. While Microsoft does caution against importing history from TFVC into your new git repository, they actually provide an option to import up to 180 days of history.

![Import Repository]({{ site.url }}/images/posts/azure-devops-import-repository.png)
*Where to find Import Repository - Image borrowed from MS documentation linked to below*

![Import TFVC Repository as GIT]({{ site.url }}/images/posts/import-tfvc-as-git.png)
*Very simple import TFVC to GIT dialog*

Remember that this is a very simple option and won't give you the customization offered by git-tfs. Also, you can use TFS to export a repository, download it to your computer, modify the remote and push it somewhere else.

Here is [MS Documentation](https://docs.microsoft.com/en-us/azure/devops/repos/git/import-from-TFVC).

Cheers