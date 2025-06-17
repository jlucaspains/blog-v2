---
layout: post
title: "It is time to move from Azure DevOps to GitHub"
date: 2025-06-13
categories:
  - azure
  - DevOps
description: >-
    TBD
cover:
    image: "/images/posts/TBD.png"
    alt: "TBD"
    caption: "TBD"
---
You are missing on features!

## Copilot PRs and more

## Advanced security & Dependabot

## GitHub is likely cheaper
The cost of using GitHub is likely lower than Azure DevOps. GitHub offers a free tier for public repositories and a very affordable Pro plan for private repositories. Azure DevOps has a free tier, but it is limited in terms of users and features. If you are using Azure DevOps, you are likely paying for the service, which can be more expensive than GitHub.

## The last hold out
Azure Boards is the last hold out for Azure DevOps. It is a great tool, but it is not enough to keep you on ADO. You can use GitHub Projects, which has been improved significantly in the last few years, and it is now a great alternative to Azure Boards.

If Azure Boards is the last thing you are holding out on and you are running Agile projects. The next question is whether you need the additional features of Azure Boards, such as advanced planning. Many projects are doing Scrum when a Kanban approach would be more suitable. Check whether you need full Scrum or if you can use a Kanban approach. If you are not sure, you can use the following decision chart to help you decide:

```mermaid
flowchart TD
    AB[Type of project work]
    AB -->|Scoped| A
    AB -->|Continuous| C
    A[Is the team dedicated<br>to the project?] 
    A -->|Yes| E[Is continuous delivery<br>required?]
    A -->|No| C[Use Kanban]
    E -->|Yes| F[Is work prioritized<br>dynamically?]
    F -->|Yes| C
    F -->|No| H[Use Scrumban]
    E -->|No| I[Are all Scrum roles<br>PO, SM, Dev, QA<br>available and dedicated?]
    I -->|No| J[Is there willingness to<br>adopt missing roles?]
    J -->|No| C[Use Kanban]
    J -->|Yes| L[Can the team commit<br>to fixed-length sprints?]
    L -->|No| H[Use Hybrid]
    L -->|Yes| N[Use Scrum]
    I -->|Yes| L
```

Cheers,\
Lucas