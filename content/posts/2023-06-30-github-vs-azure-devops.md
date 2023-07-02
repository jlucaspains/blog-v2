---
layout: post
title: "An opinionated guide to choosing between Azure DevOps and Git Hub"
date: 2023-06-30
categories:
  - vue
description: >- 
  TBD
cover:
    image: "/images/posts/placeholder.jpg"
    alt: "TBD"
    caption: "TBD"
---

Choosing the right DevOps tool can help streamline your development processes and accellerate time to market of features. Two of the most prominent options available today are Azure DevOps (ADO) and Git Hub. In this very opinionated post (you've been warned) I will try and guide you towards picking the right tool for your situation.

What about other options? If ever, we might discuss about other options farther into the future.

I am assuming you are familiar with both tools already. If not, please review [Get started with Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/get-started/?view=azure-devops) and [Get started with GitHub](https://docs.github.com/en/get-started).

Before we begin, one more important note. Let's focus on cloud hosted GitHub (github.com) and Azure DevOps (dev.azure.com). Both solutions offer self-hosted capabilities but cloud hosted options should work for the majority of this post's audience.

## TLDR;
If all you need is a decision chart, here you go:

```mermaid
flowchart
    a(Start)-->b(New Project?)
    b-->|YES|c(Open Source?)
    c-->|YES|d(Git Hub)
    c-->|NO|e(Team size <= 5)
    e-->|YES|d
    e-->|NO|f(Test Plans or Agile?)
    f-->|NO|d
    f-->|Test Plans|dd(ADO)
    f-->|Agile|g(Sprints?)
    g-->|NO|d
    g-->|YES|h(Strong planning \nneeds?)
    h-->|NO|d
    h-->|YES|dd
    b-->|NO|i(What do you use today?)
    i-->|ADO|j(Desire and \ntime to move?)
    i-->|Git Hub|d
    j-->|YES|k(Using visual \nbuilds and releases?)
    j-->|NO|dd
    k-->|NO|c
    k-->|YES|l(Desire and time \nto move and adjust?)
    l-->|YES|c
    l-->|NO|dd
    i-->|Other|m(Does it work for you?)
    m-->|Kinda|d
    m-->|YES|ddd(Other)
```

## Roadmap and popularity
Azure DevOps has been around for a while now. it was first known as Team Foundation Server which was a self-hosted only option. I remember first using TFS back in 2007 but it was first released in 2005. Later, TFS was rebranded Visual Studio Team Services, and finally Azure DevOps in 2018. ADO features and fixes are released on a sprint cadence. One can find the latest release notes in [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/release-notes/2023/sprint-223-update). While it remains an active product, it has slowed down drastically in the last few years. In January 2019, 27 items were released. That is high compared to the 7 items released in June 2023.



It is arguable that the product is mature and thus a slow down is expected. Regardless of why, feature releases have slowed down considerably.

When it comes to GitHub

## Issues vs boards


## Actions vs Pipelines


## Artifacts vs Packages


## GitHub Repo vs Azure Repo


## Missing in ADO


## Missing in GitHub


## Licensing overview


## Conclusion
