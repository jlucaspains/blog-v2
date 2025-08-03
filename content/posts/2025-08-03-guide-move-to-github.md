---
layout: post
title: "Guide to moving to GitHub from Azure DevOps"
date: 2025-08-03
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

I intend this guide to help you make the decisions that fit your needs, I will keep details on the step-by-step somewhat simple and point you towards good materials to help you with the actual migration. I will also share my opinionated recommendations on what to move, how to structure your GitHub organization and repositories, and approaches to be used. Finally, this guide assumes you are moving from Azure DevOps (ADO) to GitHub Enterprise Cloud, that you are familiar with both platforms, and that you have administrative access to both ADO and GitHub accounts.

## 1. Define what to move
Repos, pipelines, boards, artifacts, etc. Do you need to move that project/repo that hasn't had activity in 2 years? Or that pipeline that is no longer used? Take the time to review your Azure DevOps projects and repositories, and decide what you really need to move to GitHub.

Avoid moving historical data that is not truly required. Leave old project work items, repos, wikis, and artifacts in ADO. By moving only the actively used items, you will help keep your GitHub organization clean and organized.

## 2. GitHub Organization vs Azure DevOps Project
This is likely where most people will struggle. In ADO, most of the collaboration happen at the project level while the repositories (yes, multiple) are primarily for code. Work Items, Test Plans, Wiki, packages, etc are all bound to the project. In GitHub, all collaboration happens at the repository level. So Issues, Projects, Discussion, Wiki, and other collaboration tools are all bound to the repo instead of a project.

So, what's the ideal structure in GitHub? While there is no one answer, there are some best practices to consider. In general, you should consider using a single GitHub Organization for your company. One organization allows for greater collaboration and more effective management of the GitHub account. Multiple organizations are only encouraged when your projects have distinct security/compliance policies. For example, if your organization require that no single owner have access to all repositories, or if you require multiple repository management policies, or if you require different spending limits per organization, then you may consider multiple organizations.

If GitHub doesn't have a similar concept to ADO projects, where should you import ADO work items and wiki? The answer depends on how many repos there are in the project being imported. If there is only one repo, you can import the ADO work items into that repo's Issues. If there are multiple repos, you can either create a dedicated repo for the project's issues and wiki or choose one of the repos to host them. Remember that you can reference issues from any repo in PRs, Discussions, wikis, etc. You may also consider mono repos, which allow you to have multiple projects in a single repository. 

## 3. Decide your teams and permissions
if you are using GitHub Enterprise Import tool, teams and permissions are not imported when you move a repo from ADO to GitHub. So you will need to set up your teams and permissions in GitHub after the move. Consider using nesting teams where the highest level have limited access and work your way down your company's hierarchy. This will allow you to have a clear structure and make it easier to manage permissions.

Simplified example of a team structure in GitHub:
1. Everyone
   1. Project 1 team
      1. Engineering Team
      2. Ops Team
      3. Product Team
   2. Project 2 team
      1. Engineering Team
      2. Ops Team
   3. Cross Project Team
      1. Security Team

## 4. Decide how to group your repositories
There is no direct feature to group repositories in GitHub like you can in ADO projects. However, you can use GitHub's Teams to help create a logical grouping of repositories via accesses. For example, you can create a team for each project and assign the relevant repositories to that team. Additionally, you can use repository topics to help organize and categorize your repositories. The organization's page is a great place to search for repositories by topic and name.

## 5. Decide repository moving strategy
Like any git repo, you can simply adjust the origin of the repo to point to GitHub and push the code. While that includes commit history, it doesn't include PRs and branch policies. If you are using Azure DevOps Cloud and you do want a more comprehensive import experience, using the [GitHub Enterprise Importer tool](https://docs.github.com/en/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/about-migrations-from-azure-devops-to-github-enterprise-cloud) will help.

Whichever approach you choose, Work Items, Pipelines, and Wikis will not be moved automatically. You will need to use other tools or to manually migrate those artifacts.

## 6. Moving Repos
If you decided to use GEI to move your repos and PRs. Follow the [GitHub Enterprise Importer documentation](https://docs.github.com/en/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/about-migrations-from-azure-devops-to-github-enterprise-cloud).

If you just want to move the git repo without PRs, you can do it with the following steps:

1. Create the new repository in GitHub.
2. Clone the ADO repository locally.
3. Add the GitHub repository as a remote and push it.
```powershell
git remote add origin https://github.com/your-org/repo-name.git
git branch -M main
git push -u origin main
```
4. Setup permissions and create branch policies

## 7. Moving Work Items
You will need a tool to help you move work items from ADO to GitHub. I have recently been working on [adowi2gh](https://github.com/jlucaspains/adowi2gh). It is a CLI tool with many options that should cover most use cases. Note that it is still in development and doesn't cover all scenarios yet.

TODO: instructions on how to use adowi2gh

## 8. Moving Wikis
Wikis are simpler in GitHub than in ADO. In addition, to being bound to a repo in GH versus a project in ADO, ADO allows for a hierarchy of pages while GH does not and GH doesn't support attachments in wikis. The markdown syntax is also a bit different, but in general the text content should be compatible.

My recommendation is to clone the wiki repos in both ADO and GitHub and manually copy the content. Here are the steps:

1. Clone the ADO wiki repo.
2. Manually create a wiki in GitHub. You won't be able to clone it until at least the home page is created.
   1. You will need to decide where to host your wiki at this point. Either pick one of the imported repos or create a dedicated repo for wiki and issues.
3. Clone the GH wiki repo.
4. Copy the content from the ADO wiki repo to the GH wiki repo.
   1. Do not copy the .attachments folder. It is not supported in GitHub wikis.
5. Adjust the file structure as needed. Remember that GitHub wikis do not support a hierarchy of pages, so you will need to flatten the structure.
6. Update the links to files hosted in the .attachment folder
   1. You can upload the referenced files on the code repository or another location and link to them from the wiki.
7. Push the changes to the GitHub wiki repo.
8. Edit the pages with images and drag/drop the images into the GitHub wiki editor to upload them.

I've tried a few automation scripts to make this work, but found that the manual process is the most reliable.

## 9. Moving Packages
The work required for moving packages varies largely on the type of packages you are using. In general, you will need to download the packages from ADO and upload them to GitHub Packages. You should note that Universal, Python, and Cargo packages are not supported in GitHub Packages, so you will need to use a different approach for those.

General example for moving a nuget package:
1. Configure nuget.config to use the ADO feed.
2. Download the package from ADO.
```powershell
nuget install YOUR_PACKAGE_NAME -Version YOUR_VERSION -Source AzureArtifacts -OutputDirectory ./packages
```
3. Repack the package to update metadata. You would primarily update the repository URL and the package name.
   1. Extract the package to a folder.
   2. Update the `nuspec` file with the new repository URL, project URL, and package name.
```powershell
nuget pack ./extracted-package/YOUR_PACKAGE_NAME.nuspec -OutputDirectory ./repacked
```
4. Create another nuget.config file to use the GitHub Packages feed.
   1. You can use the [GitHub Packages documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-nuget-registry) to create the nuget.config file.
5. Publish the package to GitHub Packages.
```powershell
nuget push ./repacked/YOUR_PACKAGE_NAME.YOUR_VERSION.nupkg -Source GitHub
```

## 10. Moving Pipelines
the [GitHub Actions Importer]() does a good job of moving most ADO pipelines to GitHub Actions. See this [video](https://www.youtube.com/watch?v=gG-2bkmBRlI&ab_channel=EthanDennis) for a demo of the tool. Note that you will likely need manual adjustments to the pipelines after the import. For example, you will need to adjust the secrets and variables used in the pipelines, as they are not imported automatically.

## 10. Archive your moved ADO projects
You cannot directly archive ADO projects. You can, however, remove permissions for it rendering it read-only.

## 3. An opinionated list of rules

1. Use a single or few GitHub Organization for your company.
2. Archive innactive projects in ADO and leave them there.
3. Move full git commit history, but not PRs.
4. Move New or In Progress PBIs only.
5. Create one GitHub issues and wiki repository per ADO project.
6. Use hierarchy of teams to manage permissions.
7. Review your wiki content and structure before moving it. Move it manually.
8. Inventory your packages and only move packages and versions that are actively used.

Cheers,\
Lucas