---
layout: post
title: "Environment per PR the old fashioned way"
date: 2021-09-23
categories:
  - DevOps
description: >-
  If you cannot or will not use containers but still want to have environment per PR, you can still do it with VMs and IIS. I will show you how.
featured_image: 
  url: "/images/posts/code.jpg"
  attribution: Luca Bravo on Unsplash
  ref: https://unsplash.com/photos/XJXWbfSo2f0
cover:
    image: "/images/posts/code.jpg"
    # can also paste direct link from external site
    # ex. https://i.ibb.co/K0HVPBd/paper-mod-profilemode.png
    alt: "alt test"
    caption: "Image by Luca Bravo on Unsplash"
---

The expectations surrounding app releases have changed greatly in the last several years. From months-long release cycles to release many times in a day. In part, this is made possible by smaller applications powered by micro services and some of the typical technologies employed with these applications. In particular, Containers bring a lot of new capabilities including easier deployments via orchestration tools such as Kubernetes.

As a developer and team lead, one of the best added benefits of containers is how easy it is to spin up an environment for each change. What is typically called Environment per PR. Basically, you have a new, short-lived, environment dedicated for your changes.

This is beautiful, but, what if you don't or can't use containers? Can you spin up environments like this with good old VMs and IIS?

Yes. But not easily.

I'm sure that what I will be showing here is not directly applicable to you, but it should be a good start for most .NET apps deployed using AzureDevOps Pipelines to IIS and SQL Server. These are the steps:

* Build stage
  * Build, unit test, and create artifacts ready for deploy
* PR Deploy stage
  * Deploy IIS website(s)
    * Create IIS website and app pool
    * Update appsettings.json
    * Copy app files to the right location
  * Create DB
    * Create/update DB using a good backup
    * Apply DB Migrations
  * Add comment to PR

## The main pipeline

The main pipeline will only describe the stages and set up the parameters. All the actual work happens in the build and deploy stages. Skip to the end of the article to see the complete pipeline yaml files.

## Build stage
In this stage we want to build the app(s) and publish any deployables as build artifacts. I will assume that you have your app built and ready to be deployed so I won't provide details on how to do this. For the purposes of this post, you should have your backend, frontend, and db migrations as published artifacts in your build.

## Deploy PR stage
In this stage, we will do everything needed to spin up a new environment. This includes: creating a SQL Server DB, restoring a backup with good test data, creating or updating IIS App Pools and Web Sites, Deploy build stage files to appropriate folders, and finally drop a comment in the PR with the new environment URL. To make things easier to understand, let's talk about each step first and see the final stage yaml at the end.

### Restore a good backup as your PR DB
We can achieve this somewhat easily with a procedure in master DB that you can call from Powershell. You should install the latest [Sql Server PS Module](https://www.powershellgallery.com/packages/SqlServer). Also, the user running your pipeline needs very high level privileges. I will not go into whether this is a good idea or not from a security standpoint, but do tighten your DB security as much as you can.

{{< gist jlucaspains e8c05c31501be81302c766b7de185652 >}}

Then, you can invoke that procedure from Powershell like so:

{{< gist jlucaspains be54a3c49e61799be10fd695dadbb3e7 >}}

### Update DB version with PR migrations
By now, most projects are using Db Migrations one way or another. I typically do them the old fashioned way where the developer is responsible for manually creating versioned scripts. If you have the scripts in a folder like I do, [DbUp](https://dbup.github.io/) is a great tool to update your DB. There is also a [Visual Studio Marketplace extension](https://marketplace.visualstudio.com/items?itemName=johanclasson.UpdateDatabaseWithDbUp) for it. 

You may use EF migrations or anything else that suites you though.

### Deploy IIS website(s) from template xml
You can achieve this using [appcmd](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj635852(v=ws.11)) and [netsh](https://docs.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh-contexts) as they should be installed with any IIS version you may use. Below are some commands that can be executed in powershell to create a website:

{{< gist jlucaspains a4dbd315c2c8b380651b8f879e67f04e >}}

You can either create the website and app pool with specific commands like above, or, you can export and import the site and app pool. First, export existing site and app pool:

{{< gist jlucaspains 6cd808bf874080cc733aff7129d982d9 >}}

Since we want each PR site to be unique, we need to do some templating in the xml files. Just change the app pool and site names to something you can find and replace later via powershell:

{{< gist jlucaspains c697de5e6bd83cbe769ed9db115173fd >}}

You can then use some powershell to replace the placeholder before using appcmd to apply the file:

{{< gist jlucaspains 2c5fe35e3250f3b3e348da088daeb5a7 >}}

Finally, use cmd and below commands to import the site and app pool:

{{< gist jlucaspains 015286b745b445754390d9fa936fede1 >}}

Finally, appcmd won't assign certificates to HTTPS bindings. We can use netsh for that though:

{{< gist jlucaspains d37b7b9dfd1e17c28c091f687449be8e >}}

## Updating configuration files
There is a good chance you keep some settings in the appsettings.json for .NET apps and perhaps in other files for your frontend. You can easily update these settings using pipeline variables and tokenized files. I like to use [Replace Tokens from Guillaume Rouchon](https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens) marketplace extension for this.

{{< gist jlucaspains 80e65bd88993aaa499c8d7166e348587 >}}

Make sure the variable exists in your pipeline stage:

{{< gist jlucaspains 0f3fb3ae83f4362fa3971cf7bcd6c819 >}}

### Add comment to Pull Request
After the PR is deployed, you should add some instructions to the PR on how to test it. This usually includes an environment URL and anything else relevant for the test. There are many tasks to add comments to PR, but I've used [Pull Request Utils from Joachim Dalen](https://marketplace.visualstudio.com/items?itemName=joachimdalen.pull-request-utils) successfully before.

In below example, we comment the URL for the environment as well as instructions on how to update the hosts file so that DNS resolution works:

{{< gist jlucaspains d6a855796f1fe350269115db4cdaae8b >}}

## PR Environment teardown
Because your PR Environment is in the intranet, there is a good chance you can't reach it from Azure DevOps. If this is true, you won't be able to use Webhooks to tear down your environment when the PR is closed.

You can achieve this with a bit more of powershell. Use it to read the active PRs and compare to the active environments. If any environment does not have a corresponding open PR, you can tear it down.

{{< gist jlucaspains 92d71fd346106e657138f796ab3a708c >}}

## Putting everything together
There are a lot of steps to do and they are harder than they would be in more "modern" scenarios. The key point is: you don't need containers to get Environments per PR.

The final pipeline files may look like this:

{{< gist jlucaspains 3ea5b64f77f27b29bbd3893f19ad5f4a >}}
  
## More information
Here is some very useful content to read how other people have done this:

* https://medium.com/nntech/level-up-your-ci-cd-pipeline-with-pull-request-deployments-780878e2f15a
* https://devblogs.microsoft.com/devops/review-apps-in-azure-pipelines/
* https://samlearnsazure.blog/2020/02/27/creating-a-dynamic-pull-request-environment-with-azure-pipelines/
