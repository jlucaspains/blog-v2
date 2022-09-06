---
layout: post
title: "Running Agile projects in GitHub Projects"
date: 2022-09-05
draft: true
categories:
  - DevOps
description: >-
  GitHub is a fantastic tool for repos and actions. But can you do Agile with GitHub Issues? Let's find out.
cover:
    image: "/images/posts/github-sprint.jpg"
    alt: "GitHub"
    caption: "Photo by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/github?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  "
---

I have used Azure DevOps and its predecessors (Visual Studio Team Services and TFS) for a long time. In fact, I think my first time ever with TFS was back in 2007. Thus, that is usually my go-to solution for DevOps. It is undeniable how good Azure DevOps boards and pipelines are.

I have also extensively used GitHub, but it was typically for smaller and personal projects. It is hands-down the best tool for repositories. However it has always been, let's say, light in features related to Pipelines and Issues. GitHub seems to be getting a lot of love from Microsoft and both Actions and Issues are evolving at a fast pace while maintaining the GitHub flair. You can check the [Actions changelog](https://github.blog/changelog/label/actions/) and [Issues changelog](https://github.blog/changelog/label/issues/).

There is no official position from Microsoft related to Azure DevOps being deprecated in favor of GitHub. In fact, the answer is always that Azure DevOps is not going away. Funny how it is assumed that DevOps would go away and not GitHub, no?

Anyway, the question remains: as an Azure DevOps user, can I use just GitHub for my project?

The answer is "depends on what features you use". As I said, Repos are awesome, period. On a very broad sense, Actions are on par with Azure DevOps Pipelines so no problems there either. However, Issues work very differently. If you are running Agile teams, that might be a bit of a problem. In this post, I will review how you could run Agile using GitHub Projects (part of Issues).

## TLDR;
You can see my public [Sprint project in GitHub](https://github.com/users/jlucaspains/projects/1). 

## Scope
Agile has many tools and we could talk about it for days, so let's focus on Backlog and Sprints.

## Setting up a project
GitHub projects are not new. However, [an improved version](https://github.blog/changelog/2022-07-27-github-issues-projects-now-generally-available/) was made GA on July 2022. This version adds many capabilities such as custom fields and table view making Agile a bit easier to implement. At its root though, project is an organizer on top of one or more (new feature) repository Issues.

To create a project, go to your profile and select Projects, then select New Project. 

![New Project](/images/posts/github-create-project.png)

GitHub already offer a few options. The Feature template is fairly similar to an Agile template. Note that as of now you won't be able to export/import your own templates. For this post, I will start with the simple Table template.

The basic Table template will only give you the basic fields that all issues have: Title, Assignees, Status, and Labels. To make this project into an Agile project, we will need to add a few fields. You can do that by navigating to the Project Settings and adding the following fields:

* Status (Single Select)
  * New
  * Ready
  * Blocked
  * In DEV
  * In Review
  * In Test
  * Ready to Release
  * Done
* Priority (Single Select)
  * 1. Urgent
  * 2. High
  * 3. Medium
  * 4. Low
* Iteration (Iteration)
  * Iteration is a special type that would represent your typical sprint period. it has a name and start/end dates.
* Effort (Number)
  * Effort is a complexity value that is typically calculated in complexity points (1, 2, 3, 5, 8, 13, etc). The sum of all work Effort in a sprint could be your sprint velocity.
* Remaining (Number)
  * This is the actual hours remaining on a particular task. Some teams prefer to use only the Effort and others prefer to have a remaining hours for a more accurate sprint burndown.

While you are at settings, make sure to change your project name too. This is how your project should look like.

![Sprint project fields](/images/posts/github-project-fields.png)

## Stories and Bugs
In GitHub Projects, all items are either an issue, a Pull Request or a draft item. For Agile based projects, tracking a Pull Request as a project item might be too late and draft items have less fields available. While you can add more information to any of these primitive items, the possibilities are limited to the additional field types provided by Projects.

In generic Agile, you would use Stories (as user x I want to do y) or Bugs to track the work. If you are more of a Scrum practitioner, you would use Product Backlog Items. These come with specific fields that help you track the purpose and the verification process of the deliverable. Well, the items that may go on a project might not have similar granularity. As a result, you might need to leverage the Description field to add sections like Acceptance Criteria, Task list and so on. In this matter, templates can only go so far. When creating an item directly from the project, you will not be able (yet) to leverage the repository's available templates.

Another limitation of project items is dependency tracking. You may link items by referencing each other from comments or the description field, but there is very limited visibility to this type of association.

This is an example of a Story item (note the Labels defining as an enhancement and the custom Description):

![Backlog story](/images/posts/github-project-story.png)

## Backlog
In the main view of the project, find and rename the View 1 view to Backlog. At the same time, make the newly added fields visible and sort by Priority.

![Backlog fields](/images/posts/github-project-backlog.png)

If you need more granular prioritization, you can create a new field called Backlog Order and sort by that. It might become a bit challenging to move things around though.

When Issues are closed or you mark them as Done in your project, they don't get removed from the Backlog by default. For that, you will need to setup a filter in the Backlog to exclude Done items. Use ``CTRL + F`` to activate search and type ``-Status:Done``. The minus defines the filter as an exclusion instead of inclusion.

At this point, your Backlog is ready to have items. After you create some items, it should look like this:

![Backlog view](/images/posts/github-project-backlog2.png)

## Current sprint
Now that you have a backlog, you can assign Issues to Iterations. This way, you can setup one or more views related to the Iterations themselves. For instance, let's create a Current Sprint view of type Board. All project items will automatically show in the new view but we only want the items in current Iteration (or sprint). Use ``CTRL + F`` to activate search and type ``iteration:@current -status:New``. The first filter uses the Iteration field to only show items in current iteration, as in, the iteration which dates contain today's date. Because we don't want items that are not Ready to be worked on in the sprint, we add an additional exclusion filter for the status new.

![Sprint View](/images/posts/github-project-sprint.png)

## Other views
Now that we know how to create views, we can go crazy and create as many as necessary. I would create at least one more for Blocked Work as a table. You can do that by using a label or status and filtering by it.

## Workflows
Project items and Issues are still mostly separate. Closing an issue will not move it to done in the Project for instance. That's where Workflows can help. Currently, Workflows are fairly limited but GitHub is [planning on improvements](https://github.blog/2022-07-27-planning-next-to-your-code-github-projects-is-now-generally-available/#whats-next). As of now, you will be able to automate the following actions that can happen on a Issue or Pull Request:

![Workflows](/images/posts/github-project-workflow.png)

Note that the only resulting action from a workflow is to change an item status right now.

## Reporting
Reporting is very basic right now. You can use any of the fields available to create reports but you can only do historical reports if you have an Enterprise organization. Even then, the reports remain basic. You won't be able to build a proper burndown for instance because there is no way to create the ideal line. Here is an example burndown:

![Workflows](/images/posts/github-project-burndown.png)

## Final thoughts
GitHub cannot yet provide comparable project management functionality like Azure DevOps. Perhaps that is not the goal either. But it is definitely worthwhile to keep an eye on the progress. If you are able to live with the limitations right now, I recommend getting started today!

Cheers,

Lucas