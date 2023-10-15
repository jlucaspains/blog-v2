---
layout: post
title: "Expert level code reviews"
date: 2023-10-10
categories:
  - DevOps
description: >-
  TBD
cover:
    image: "/images/posts/default.jpg"
    alt: ""
    caption: ""
---

## Why perform code reviews?
In short, you should perform code reviews to ensure that the code being delivered is of high quality. Code debt accumulates slowly over time and eventually it is so large that even trivial changes become challenging. While it is hard to prevent this from happening, code reviews can greatly help reduce code debt and increase overall code quality.

## Who should perform code reviews?
Everyone. There is a difference between reviewing code and approving code. The former should be done by everyone, the latter should be done by experienced team members. Note that experience here doesn't only mean years of general experience, but also experience with the code base and the business domain. This prevents the many memes out there where the intern approves a PR from another intern and it breaks production.

<image>

## When to perform code reviews?
Most modern projects uses git or something similar for source control. When an appropriate branching strategy is employed, it allows for new code to be reviewed just before merging back into the primary branch. Ideally, this is done with a Pull or Merge Request. A PR allows for a discussion to take place and for the code to be improved before it is merged. It also allows for the code to be reviewed by multiple people.

Choosing the appropriate branching strategy is outside of the scope of this article, but as long as you don't directly commit and push to your primary branch, code reviews can be performed.

## What to look for in code reviews?
This is a very broad question and the answer will vary from project to project. However, there are some general guidelines that can be followed:

1\. Is the change small enough?

The larger the change, the less relevant the review becomes. This is because it is difficult to understand the impact of a large change. It is better to split it into multiple changes. This also allows for each change to be reviewed in parallel.

2\. Does the code do what it is supposed to do?

The best PR will implement/fix a single change/problem which should be well described in the context of the PR. Typically, binding the PR to a work item tracking software like GitHub, Azure DevOps, or Jira will help with this. The reviewer can then check the intended change against the code.

3\. Does the code follow the coding styling rules?

This is a common point of contention. It is rare for people to agree on code styling. While everyone knows that spaces are better than tabs (see what I did here?) not everybody agrees. Jokes aside, there is no right or wrong when it comes to styling. It is important only that a standard is agreed upon and enforced. Code reviews are a great place to enforce code styling.

4\. Does the code introduce any security vulnerabilities?

In my experience, this is often the most overlook aspect of code reviews. Security cannot be a feature, instead, it needs to be treated as a requirement. Every little good practice counts whether it is a major design aspect or very minor. The goal is to make it as difficult as possible to break into any system. That said, it is very hard to spot security issues and manual reviews are not good enough. There are tools for this and I will discuss a few later in this article.

5\. Does the code introduce any performance issues?

Another aspect often overlooked in code reviews. Also, another hard to manually validate. In general, an experienced reviewer will be able to spot patterns to be avoided and will be able to spot potential performance issues. But only by measuring and benchmarking performance you can really be sure that no issues are introduced. In an ideal world, performance tests would be part of the CI/CD pipeline and would be run automatically. 

6\. Is the change documented appropriately?

Documentation is the bane of every developer. We either put comment in every line of code or not at all. Documentation in this case refers to how well the change is documented. It can be code level artifacts, wiki entry, or even a change log. Regardless, as long as the method is agreed upon, it should also be enforced via code reviews.

## How to perform code reviews?
First and foremost, do use a code review tool. Most git platforms offer this functionality. Examples are GitHub PR, Azure DevOps PR, Git Lab Merge Request, etc. The following items are general guidelines I follow myself when reviewing code:

1\. Use a checklist

A simple markdown file with a list of items to check. This will help you not forget anything. It will also help you be consistent across reviews. It is also a good idea to have a checklist for the author to go through before submitting the PR. This will help reduce the number of comments and iterations.

2\. Do use code comparison

Most code review tools will allow you to compare the changes with the previous version. This is a great way to spot check the changes to see if they pass the smell check and whether they are in the context of a single change or something unrelated.

3\. Be liberal with comments and questions

Comments are a great way to communicate with the author. Questions, suggestions, compliments, or concerns should all become discussion topics in the PR. The more comments you leave, the more the author and yourself will learn and the better the code will be.

4\. Enforce merge rules

* Require at least one approval besides the author.
* Require a build or validation pipeline to pass before merging. At a minimum, it should contain:
   * Build any relevant artifacts
   * Tests are executed (unit, integration, end-to-end, etc.)
* Require all comments to be addressed before merging.
* Require a work item to be associated with the PR (GitHub issue, Azure DevOps work item, Jira ticket, etc.)

Obviously, avoid exceptions to the merge rules as much as possible.

## Automation, Automation, Automation
As mentioned above, there are some things that are hard to spot manually. This is where automation shines. Most git platforms support automation workflows. For instance, GitHub has GitHub Actions, Azure DevOps has Azure Pipelines, GitLab has GitLab CI/CD, etc. It is fairly common to automate build and unit tests, however, you can leverage these tools to automate other aspects of code reviews. Here are some examples:

1\. Lint the code

A linting tool can help catch syntax and style issues early. Add it to the validation build to ensure issues are not added by the change. The linting tool depends on the language and framework used. For instance, for JavaScript, you can use [ESLint](https://eslint.org/).

For an example, see [sharp-recipe-parser PR Validation GitHub Action](https://github.com/jlucaspains/sharp-recipe-parser/blob/main/.github/workflows/pr-validation.yml).

2\. Run a code quality tool

This is one of my favorite ways to ensure code quality. It is almost "free lunch" in form of a review. Many of the options available perform deep code-analysis and identify code smells, bugs, vulnerabilities, etc. Again, there are many options available and they are language and framework dependent. For instance, I use [Sonar Cloud](https://www.sonarsource.com/products/sonarcloud/) very often since it is free for open-source projects.

For an example, see [sharp-recipe-parser PR Validation GitHub Action](https://github.com/jlucaspains/sharp-recipe-parser/blob/main/.github/workflows/pr-validation.yml).

3\. Run security scans

Ensuring code changes don't introduce security issues is very important and very hard. Using a security scanner can help identify potential issues. Again, there are many options available and they are language and framework dependent. A great option for this is [Snyk](https://snyk.io/). Just like Sonar Cloud, it is free for open-source projects.

4\. Deploy the code to a test environment

Deploying code from PRs can be very challenging. I only recommend this approch if you have good and comprehensive end-to-end tests in addition to a test environment that supports slots. This approach is also called Environment per PR and it is very powerful. It enables automated tests to execute and provide feedback before a reviewer ever looks at the code.

For an example, see [sharp-cooking-web PR Validation GitHub Action](https://github.com/jlucaspains/sharp-cooking-web/blob/main/.github/workflows/azure-static-web-apps-delightful-flower-0c3edd710.yml). Every time a PR is created, it creates a new Azure App Service slot, deploys the code, and runs end-to-end tests. The results are then posted back to the PR.

## Closing thoughts