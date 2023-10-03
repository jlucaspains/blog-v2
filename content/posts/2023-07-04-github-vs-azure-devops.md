---
layout: post
title: "An opinionated guide to choosing between Azure DevOps and Git Hub"
date: 2023-07-04
categories:
  - DevOps
description: >- 
  Choosing between Azure DevOps and GitHub for your DevOps needs can be a challenging decision. In this opinionated guide, I will provide insights to help you navigate the selection process
cover:
    image: "/images/posts/infinity.jpg"
    alt: "Infinity"
    caption: "Photo by [Izabel](https://unsplash.com/@peacelily234?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/ouwdw--XNzo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

Choosing the right DevOps tool can streamline your development processes and accelerate time to market for features. Two of the most prominent options available today are Azure DevOps (ADO) and GitHub. In this very opinionated post (you've been warned), I will guide you towards picking the right tool for your situation.

What about other options? We might discuss other options in the future.

I am assuming you are familiar with both tools already. If not, please review [Get started with Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/get-started/?view=azure-devops) and [Get started with GitHub](https://docs.github.com/en/get-started).

One more important note: let's focus on cloud-hosted GitHub (github.com) and Azure DevOps (dev.azure.com). Both solutions offer self-hosted capabilities, but cloud-hosted options should work for the majority of this post's audience.


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

## Roadmap and Popularity
Azure DevOps has been around for a while now. Initially known as Team Foundation Server, it was a self-hosted option only. I first used TFS back in 2007, although it was first released in 2005. Later, TFS was rebranded as Visual Studio Team Services, and finally as Azure DevOps in 2018. ADO features and fixes are released on a sprint cadence, and the latest release notes can be found on [Microsoft Learn](<https://learn.microsoft.com/en-us/azure/devops/release-notes/2023/sprint-223-update>). While it remains an active product, it has slowed down considerably in the last few years. In January 2019, 27 items were released, which is much higher than the 7 items released in June 2023.

It can be argued that ADO is a mature product and thus a slowdown in feature releases is expected. However, the rate of feature releases has considerably decreased. It feels like Microsoft is slowly pushing people towards using GitHub, as evidenced by the learning material offered, the more recent tools like [Dev Home](<https://learn.microsoft.com/en-us/windows/dev-home/>) that favor GitHub, and the fact that a lot of Microsoft's own code is on GitHub.

GitHub was launched in 2008 and grew in popularity very quickly. In my opinion, what made GitHub so popular was how much the open-source community embraced it as the de facto source control tool. Not to mention how good git was from the beginning. At a time when Team Foundation Version Control and similar source control systems were used, git quickly became a great alternative. GitHub is a very active product with a fast-paced release cycle. New features often appear daily on the [GitHub changelog](<https://github.blog/changelog/>).

It is a bit difficult to compare the popularity of ADO and GitHub. Primarily, I have observed ADO being used by enterprises, especially those using other tools from the Microsoft ecosystem such as Visual Studio and .NET. GitHub seems to be more widely used by open-source and public projects, although more and more enterprises have been using GitHub in recent years. The Stack Overflow Survey published in 2022 provided some insight into which platforms developers used. The survey specifically asked about source control but should serve as a light popularity indicator:

![Stack Overflow Survey 2022 - Source Control usage](/images/posts/so_survey_2022.png)

There was no equivalent data in the [Stack Overflow Survey 2023](<https://survey.stackoverflow.co/2023/>). You can read the full survey at [Stack Overflow Survey 2022](<https://survey.stackoverflow.co/2022>).

When it comes to roadmap and popularity, GitHub is the way to go.

## Issues vs boards
Azure Boards is a powerful planning tool that excels when running full agile. It offers customizable templates, fields, workflows, and numerous extensions. Even without customization, it provides great features out of the box and works well for full agile, including planning with backlogs and execution with sprints. It's also great if you just need a board.

GitHub Issues, on the other hand, work differently from ADO work items. They are basic tracking items, but when combined with Projects, they become much more powerful. In a [previous post]({{< ref "/posts/2022-09-05-GitHub-sprint-projects" >}}), I discussed using GitHub Projects in a similar manner to ADO for running Agile projects. While the tool wasn't quite ready for my purposes at the time, it has since improved significantly. One caveat is that you have to set up nearly everything yourself with GitHub Projects, which may be a drawback for some.

Currently, ADO provides the best tool for planning and work execution, but GitHub is catching up fast.

## Actions vs Pipelines
GitHub Actions and ADO Pipelines are quite similar in terms of features offered. However, there are a few differences to keep in mind:

1. Actions offer parallelism by default, while in ADO you have to pay for it.
2. In ADO, secrets and variables are added to libraries and can be sourced from an Azure Key Vault. In GitHub, secrets are added to the repo or org, and variables are typically added as files. You can also add steps to the pipeline itself to import secrets from an Azure Key Vault.

Both options are very powerful, and to me it's a tie.

## GitHub Repos vs Azure Repos
Both tools, GitHub and Azure DevOps, utilize Git for source control. One notable advantage of GitHub is its ease of integrating extensions with pull requests, providing enhanced insights. While Azure DevOps also supports similar functionality, it may require additional effort to achieve the same level of integration. Another standout feature of GitHub is Dependabot, which simplifies dependency and security updates. With solid tests in place, fixing issues becomes faster and more efficient. On the other hand, Azure DevOps offers a commendable user interface for pull requests, which some may find preferable. 

GitHub also excels in secret scanning, promptly detecting and disabling accidentally committed sensitive information. While Azure DevOps can achieve similar results through paid extensions, the combination of Dependabot and secret scanning positions GitHub as a stronger choice for source control in my opinion.

## Missing features
ADO offers Test Plans, a feature that teams can use to drive manual testing and validation. GitHub does not have an equivalent built-in feature.

GitHub's builtin security features such as Dependabot, Secret Scanning, and CodeQL far surpasses what ADO provides out of the box. To do something similar in ADO, you will need paid extensions.

GitHub also has a feature called Pages, which allows you to host static websites directly from your repository. ADO doesn't have this feature built-in, but you can achieve a similar result using free Azure services like Azure Static Web Sites.

## Conclusion
If you had asked me last year, I would have likely suggested using Azure DevOps (ADO) for most non-open-source projects. At that time, ADO pipelines were more advanced than GitHub Actions, and ADO's planning tools were significantly ahead. However, GitHub has been progressing rapidly. Actions are now on par with, if not better than, Pipelines. Additionally, GitHub's Projects feature is becoming so impressive that I no longer feel like I'm missing out on ADO.  

In my opinion, GitHub has now taken the lead in the game. When considering the slowdown of ADO's feature development, it solidifies my recommendation of GitHub for most projects. However, if you require ADO's advanced agile features or Test Plans, which are exclusive to ADO, a hybrid approach might work better for you.