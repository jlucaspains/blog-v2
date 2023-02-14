---
draft: true
layout: post
title: "Rewriting SharpCooking from Xamarin to PWA - Part 4"
date: 2023-02-15
categories:
  - xamarin
  - iOS
  - android
  - series
description: >-
  This is the fourth post on the rewriting SharpCooking series. We've covered the coding parts this far, now, let's talk about DevOps.
cover:
    image: "/images/posts/sharp-cooking.png"
    alt: "Sharp Cooking"
    caption: "Sharp Cooking"
---

This is the fourth post on the series, if you haven't seen the other posts yet, I recommend you read them for added context.

1. [The why and high level how]({{< ref "/posts/2023-01-01-rewriting-sharp-cooking-app-part-1" >}})
2. [The tech stack]({{< ref "/posts/2023-01-15-rewriting-sharp-cooking-app-part-2" >}})
3. [The unplanned API]({{< ref "/posts/2023-01-29-rewriting-sharp-cooking-app-part-3" >}})

In this post we will review the decisions and methods related to DevSecOps of Sharp Cooking. To summarize to the extreme, DevOps is all about people, processes, and tools. We then add security on top so that it is center and foremost in the development lifecyle.

Before we begin, keep in mind how simple Sharp Cooking is. Its DevSecOps is also simple since it is not worthwhile to use rocket science. The key here is that while it is simple, it does exist and it is enforced.

## Source Control
It's been a long time since I used anything other than git for Source Control. At the moment, I see no reason to change this so Git is the choice for Sharp Cooking. Because the project is also Open Source, GitHub is used as the development platform.

The decision to use GitHub is not as simple as it seems. Part of what will be discussed later in this article are the other tools provided such as GitHub Actions and Issues.

The runner up on this decision was Azure DevOps. It allows for git source control, Azure Pipelines is probably the best CI/CD tools I have used, and the Boards are much more comprehensive than GitHub. However, GitHub is more popular for open source projects and while there is no official word from Microsoft, it is my opinion that Microsoft will eventually move away from Azure DevOps in favor of GitHub.

### Branching strategy

## Build and Deploy
GitHub Actions with automation

## Versioning
GitVersion

## Monitoring
Nothing yet
No good analytics

## Dependabot
npm packages via yarn. Use dependabot to auto-update weekly.

## Hosting
I initially leveraged the [GitHub pages](https://pages.github.com) feature available in any public repository to host Sharp Cooking app. GitHub pages is free and very easy to setup: upload the files in a repository or sub-folder and setup GitHub pages to serve the folder. The resulting site is available at https://username.github.io/repository-name. 

When the Sharp Cooking API was introduced, it also created a challenge to using GitHub pages. APIs are not supported in GitHub pages. Back to the original idea of rewriting the app, whatever solution I used, it should be free so I first tried Azure App Service as it does have a fairly generous free tier. It does come with limitations, as it should be expected of any free offering. The primary limitation that made using Azure App Service hard to use is that it does get stopped when it is idle for a certain period of time. That meant that downloading a single recipe could take as long as 40 seconds because of the cold start. Interestingly, converting the App Service app into a Azure Function yielded much better overall performance so I switched to that.

I wanted to publish the API and app together. [Azure Static Web App](https://azure.microsoft.com/en-us/products/app-service/static) does offer integration with Azure Function. 

## Release notes
GitHub release notes? Can they be auto-generated?

## Documentation
Hugo + Geekdoc = ❤️

## Testing
Playwright = ❤️❤️❤️

## Playwright notes
* Mock browser-fs-access
* Test target browsers and reasons
* Test timeout on Safari desktop and mobile
  * Browser closed - Test timeout of 30000ms exceeded.
* Tests are slow
* Github agent timeout of 1 hour (double-check)
* Fixing flaky tests
* Create tests specific for a browser