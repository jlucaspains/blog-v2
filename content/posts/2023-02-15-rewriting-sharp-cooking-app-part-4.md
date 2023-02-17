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
  This is the fourth post on the rewriting SharpCooking series. We've covered the coding parts this far, now, let's talk about DevSecOps.
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

## Hosting
I initially leveraged the [GitHub pages](https://pages.github.com) feature available in any public repository to host Sharp Cooking app. GitHub pages is free and very easy to setup: upload the files in a repository or sub-folder and setup GitHub pages to serve the folder. The resulting site is available at https://username.github.io/repository-name. 

When the Sharp Cooking API was introduced, it also created a challenge to using GitHub pages. APIs are not supported in GitHub pages. Back to the original idea of rewriting the app, whatever solution I used, it should be free so I first tried Azure App Service as it does have a fairly generous free tier. It does come with limitations, as it should be expected of any free offering. The primary limitation that made using Azure App Service hard to use is that it does get stopped when it is idle for a certain period of time. That meant that downloading a single recipe could take as long as 40 seconds because of the cold start. Interestingly, converting the App Service app into a Azure Function yielded much better overall performance so I switched to that.

I wanted to publish the API and app together so I also looked into [Azure Static Web App](https://azure.microsoft.com/en-us/products/app-service/static). It does offer, well, static web app hosting but it also provides integration with Azure Function while still having a free tier offering. Given the very minor changes required to the code base, I decided to pivot and use Azure Static Web App instead of GitHub.

## Development Platform
It's been a long time since I used anything other than git for Source Control. Since I see no reason to change this, Git is used for Sharp Cooking source control. Because the project is also Open Source, GitHub is used as the development platform.

The decision to use GitHub is not as simple as it seems. Part of what will be discussed later in this article are the other tools provided such as GitHub Actions and Issues.

The runner up on this decision was Azure DevOps. It allows for git source control, Azure Pipelines is probably the best CI/CD tools I have used, and the Boards are much more comprehensive than GitHub. However, GitHub is more popular for open source projects and while there is no official word from Microsoft, it is my opinion that Microsoft will eventually move away from Azure DevOps in favor of GitHub.

### Git branching strategy
Currently, there is only one developer in the project. Me. A branching strategy does sound like overkill at this point, but pushing directly to main makes my skin tingle like I got spiders walking all over me. If we have to name a strategy, GitHub flow is the simplest strategy that fits the current project's needs. If you are unfamiliar with it, GitHub flow uses branches for all development, the branches are taken off of main and always merged via pull request into main. The primary requirement is that main is always deployable. If you are interested but unsure how it works, read this [great comparison between Git Flow and GitHub Flow](https://www.geeksforgeeks.org/git-flow-vs-github-flow/).

To summarize, main branch is protected and code can only be merged into it via Pull Requests. Every time a pull request is created, a Git Hub Action is executed that will build, validate, and publish a version of the website for additional manual review and testing. This strategy enphasize the importance of proper testing. If you are confident that passing tests means a good version then this approach might be a great fit for you.

### Versioning
The original app was updated infrequently. As often as once per week and sometimes once in several months. This release cycle made versioning and release notes important. The version number used was [semver](https://semver.org) with Major.Minor.Patch. In fact, the very latest version of the app was 1.7.0.

One of the small annoyances related to app releases is to manually set the version number before a release. I must have forgotten this step several times and that created additional work because a secondary release was often needed to fix this mistake. With SharpCooking, I wanted to automate this process but keep using semver. For this, I used [GitVersion](https://gitversion.net/) which is a convention based tool that uses git log to generate a semver version number.

In the case of SharpCooking, I decided to prepend commit messages with a few keywords that helped GitVersion to determine the version number upon every commit. The configuration for GitVersion looked like below. 

```yml
mode: Mainline # mainline is the most compatible mode for GitHubFlow
branches: {} # all branches have the same config
ignore:
  sha: []
# below settings use keywords to determine which component of semver version number will increase
major-version-bump-message: '^(breaking|major):'
minor-version-bump-message: '^(feature|minor):'
patch-version-bump-message: '^(fix|patch):'
no-bump-message: '^(none|skip):' # this is a special marker so no version number increases
merge-message-formats: {}
```

Finally, the version is actually generated on CI/CD of main branch. The following steps were used in GitHub Actions to install GitVersion, generate the version number, and store in a .env file the app can read in runtime:

```yml
- name: Install GitVersion
  uses: gittools/actions/gitversion/setup@v0.9.7
  with:
    versionSpec: '5.x'

- name: Determine Version
  id: gitversion
  uses: gittools/actions/gitversion/execute@v0.9.7
  with:
    useConfigFile: true

- name: Set Version number in .env
  uses: datamonsters/replace-action@v2
  with:
    files: '.env'
    replacements: 'DEV=${{ steps.gitversion.outputs.majorMinorPatch }}'
```

### CI / CD
A key requirement for me was to automate the validation and deploy of Sharp Cooking as much as possible. Therefore, a key component of the DevOps strategy was CI / CD workflows. GitHub Actions is very powerful and allows for everything Sharp Cooking needed:

1. Perform Static Code Analysis with SonarCloud
```yml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```
2. Calculate and apply version number ([See Versioning](#Versioning))
3. Compile and package the application
   * The compilation is done by Static Web App so the build and deploy are a single step. 
4. Deploy Web app and API to Azure
```yml
- name: Build And Deploy
  id: builddeploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_FLOWER_0C3EDD710 }}
    repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
    action: "upload"
    app_location: "/" # App source code path
    api_location: "api" # Api source code path - optional
    output_location: "dist" # Built app content directory - optional
```
5. Execute end to end test suite using [Playwright](https://playwright.dev/)
```yml
- name: Run Playwright tests
  run: |
    npx playwright install chromium firefox webkit
    HOME=/root npx playwright test
```

Additionally, the workflow should be executed for each PR created and when master is updated. For PR executions, the deployment should create or update a staging environment. For main branch executions, the deployment should update production environment.

See the [workflow in the repository](https://github.com/jlucaspains/sharp-cooking-web/blob/main/.github/workflows/azure-static-web-apps-delightful-flower-0c3edd710.yml) for full reference.

### Testing
Deciding the appropriate approach for testing Sharp Cooking was very hard. There are two software components to test: the SPA app and the API. I honestly haven't had success with unit tests for SPA applications. The tests often become shallow and you end up writting too much test code for little benefit. In general, I prefer to test code based on what (or who) is consuming it. If I have a shared piece of code that is used by many components that should probably be unit tested. For UIs, I see a lot more value with end to end testing with minimal to no mocking. As for the API, that makes much more sense to unit test. The Sharp Cooking API is especially easy because, again, it is so simple.

I chose Playwright for end to end testing of the SPA app. I'm planning an article about using Playwright to test Sharp Cooking so I will not add a lot of details in this post. However, I'm truly in awe of how good Playwright is. The tooling is excellent, tests are very stable with very little flakyness, and the documentation is great.

As for the API, I used [pytest](https://docs.pytest.org/en/7.2.x/). My python experience is fairly shallow, however, pytest did the job just fine for Sharp Cooking.

### Change log
GitHub release notes? Can they be auto-generated?

### Dependabot
npm packages via yarn. Use dependabot to auto-update weekly.

## Monitoring
This is an area where Sharp Cooking is lacking severely. As of now, there is no real monitoring for the published app nor is there any type of usage analytics. The challenge is about cost and compliance, Azure App Insights is great, but there is no free offering for it. As for analytics, Google Analytics is free however is notorious in the EU where the original app had users so I don't want to use it yet.

## Documentation
Hugo + Geekdoc = ❤️
