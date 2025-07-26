---
layout: post
title: "Guid to moving to GitHub from Azure DevOps"
date: 2025-06-18
categories:
  - DevOps
description: >-
    TBD
cover:
    image: "/images/posts/move-from-ado-to-github.png"
    alt: "Making the switch from Azure DevOps to GitHub"
    caption: "Making the switch from Azure DevOps to GitHub"
---

In my last post, I recommended that Azure DevOps users consider moving to GitHub. This post is a guide to help you make that transition smoothly.

## 1. Define what to move
Repos, pipelines, boards, artifacts, etc. Do you need to move that project/repo that hasn't had activity in 2 years? Or that pipeline that is no longer used? Take the time to review your Azure DevOps projects and repositories, and decide what you really need to move to GitHub.

A practical tip: do not move historical data that is not used anymore. Leave old projects, work items, and repos in ADO, and only move the ones that are actively used. This will help you keep your GitHub organization clean and organized.

## 2. GitHub Organization vs Azure DevOps Project
This is likely where most people will struggle. In ADO, most of the collaboration happen at the project level while the repositories (yes, multiple) are primarily for code. Work Items, Test Plans, Wiki, packages, etc are all bound to the project. In GitHub, all collaboration happens at the repository level. So Issues, Projects, Discussion, Wiki, and other collaboration tools are all bound to the repo instead of a project.

So, what's the ideal structure in GitHub? While there is no one answer, there are some best practices to consider. In general, you should consider using a single GitHub Organization for your company. One organization allows for greater collaboration and more effective management of the GitHub account. Multiple organizations are only encouraged when your projects have distinct security/compliance policies. For example, if your organization require that no single owner have access to all repositories, or if you require multiple repository management policies, then you may consider multiple organizations.

Another key difference is that ADO work items are tied to the ADO Organization, while in GitHub, they are tied to the repository.

When it comes to permissions, Azure DevOps uses a project-based model, while GitHub uses a team-based model. In GitHub, you can create teams within your organization and assign permissions to those teams for specific repositories. This allows for more granular control over who can access and modify each repository.

It is recommended you limit the number of organizations in GH to a minimum. The best analogy is to think of GitHub Organizations as your company, and the repositories as your projects. You can use Teams to setup permissions for the repositories. What about exceptions? When teams are entirely separate, you may create an organization for them as there is no reference between the teams. Remember that that doesn't foster collaboration between teams, so use this option sparingly.

Questions to answer:
1. ADO work items belong to the project, where to import them in GH?
2. Sync with Azure Entra ID?

## 3.  


Cheers,\
Lucas