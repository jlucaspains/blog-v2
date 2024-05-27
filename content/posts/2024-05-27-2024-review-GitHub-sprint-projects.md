---
layout: post
title: "Running Agile projects in GitHub Projects - 2024 review"
date: 2024-05-27
categories:
  - DevOps
description: >-
    Back in September 2022, I wrote about running Agile projects in GitHub Projects. Let's review how it has evolved since then.
cover:
    image: "/images/posts/github-roadmap-may-2024.jpeg"
    alt: "GitHub Public Roadmap"
    caption: "GitHub Public Roadmap"
---

In September 2022, I shared insights on [Running Agile projects in GitHub Projects]({{< ref "/posts/2022-09-05-GitHub-sprint-projects" >}}), concluding that while feasible, it wasn't as feature-rich as Azure DevOps. I also highlighted the significant improvements in GitHub due to Microsoft's dedication. Now, in May 2024, let's revisit GitHub Projects and see how it has evolved.

## New Features

Here are some notable changes in GitHub Projects:

### 1. [GitHub projects on mobile app](https://github.blog/changelog/2022-10-11-on-the-go-with-github-projects-on-github-mobile-public-beta/):

Depending on your project management style, this feature can be quite useful. Note that Azure DevOps lacks a similar feature, and its web UI is not ideal for mobile devices.

![GitHub Mobile](https://i0.wp.com/user-images.githubusercontent.com/7498102/194122511-b4023f60-6088-43f7-a55a-fe1b6bd3db72.png?w=1200&ssl=1)

> source: https://github.blog/changelog/2022-10-11-on-the-go-with-github-projects-on-github-mobile-public-beta/

### 2. [Task list (still in private beta)](https://docs.github.com/en/issues/managing-your-tasks-with-tasklists/creating-a-tasklist):

As I mentioned before, hierarchy is a significant feature missing in GitHub Projects. Unfortunately, task lists have been in private beta for over a year, and it seems we'll have to wait longer to review them in a stable form. However, they could dramatically improve GitHub Projects.

### 3. [Roadmaps](https://github.blog/changelog/2023-03-23-roadmaps-in-projects-are-now-generally-available/):

This feature is excellent for tracking broader goals. While milestones are useful, they lack the detailed information that a roadmap can provide.

{{< video src="https://user-images.githubusercontent.com/101840513/227036955-dd7dbc03-efc4-41ed-8c53-0a1f649d47a9.mp4#t=0.001" >}}

> source: https://github.blog/changelog/2023-03-23-roadmaps-in-projects-are-now-generally-available/

### 4. [Bulk Editing](https://github.blog/changelog/2023-04-06-github-issues-projects-april-6th-update/):

This feature greatly improves convenience in GitHub projects. You can either copy/paste information or drag a cell's value to several cells, much like in Excel.

{{< video src="https://user-images.githubusercontent.com/98360703/230443138-c3231ceb-7dc1-425d-8c57-fc6d0b30545a.mp4#t=0.001" >}}

> source: https://github.blog/changelog/2023-04-06-github-issues-projects-april-6th-update/

### 5. [Project Templates](https://github.blog/changelog/2023-05-25-github-issues-projects-may-25th-update/)

Project setup can be tedious. Templates can help expedite this process.

![Project Templates](https://i0.wp.com/user-images.githubusercontent.com/2180038/239328106-ecfdafdc-11b5-436d-a163-07b7d9326f3f.png?ssl=1)

> source: https://github.blog/changelog/2023-05-25-github-issues-projects-may-25th-update/

### 6. [Board swimlanes with group by](https://github.blog/changelog/2023-07-27-github-issues-projects-july-27th-update/)

This feature improves project visibility. You can now group by any field in the board view and see swimlanes for each group.

![Board swimlanes](https://github.com/github/release-assets/assets/101840513/08dfc74e-bd1f-4527-9448-fe39c6e62332)

> source: https://github.blog/changelog/2023-07-27-github-issues-projects-july-27th-update/

### 7. [Slice by](https://github.blog/changelog/2023-08-10-github-issues-projects-august-10th-update/)

This feature is like swimlanes but serves as a filter instead of a group by.

![Slice by](https://i0.wp.com/user-images.githubusercontent.com/2180038/259850616-e8bed780-945e-475d-bb9c-4659b6bd2d34.jpg?ssl=1)

> source: https://github.blog/changelog/2023-08-10-github-issues-projects-august-10th-update/

### 8. [Project status updates](https://github.blog/changelog/2024-01-18-github-issues-projects-project-status-updates-issues-side-panel/)

This feature allows for quick updates for stakeholders directly on the project page.

{{< video src="https://user-images.githubusercontent.com/101840513/297564154-0807fa59-b9fa-4ebb-b04a-7ce2e62e026d.mp4#t=0.001" >}}

> source: https://github.blog/changelog/2024-01-18-github-issues-projects-project-status-updates-issues-side-panel/

### Is The Agile Experience Improved?

The previous feature list is not exhaustive. It's a quick summary of some significant changes in GitHub Projects since my last post.

Like before, GitHub projects still lack two fundamental capabilities:

1. Issue hierarchy. The Issue Hierarchy feature on the roadmap seems to fulfill this need, but it has been in progress for over a year and major changes have occurred. You can see the roadmap description at [Public beta of Issue hierarchy (task list)](<https://github.com/github/roadmap/issues/760>).

2. Historical data. If you have a GitHub Team or Enterprise license, you can build historical charts, but they only show the issue status (created and closed). Moreover, the charting capabilities in the Project are extremely limited. For example, the only way to build a burndown chart is to use graphql and create it yourself. I've attempted burndown generation [here](https://github.com/jlucaspains/github-charts). Remember, unless you take daily snapshots of the project data, which currently can't be filtered by iteration, you can't track changes to custom fields like Remaining Hours.

## The Future

Here's a look at the GitHub Public Roadmap, filtered by items related to Projects and Issues:

![GitHub Public Roadmap](/images/posts/github-roadmap-may-2024.jpeg)

The standout item is [Activity History](<https://github.com/github/roadmap/issues/816>). The details are vague, but it may include changes to all project fields. If it does, it could revolutionize historical data.

Cheers,\
Lucas