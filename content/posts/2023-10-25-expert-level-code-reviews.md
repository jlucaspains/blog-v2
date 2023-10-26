---
layout: post
title: "Expert level code reviews"
date: 2023-10-25
categories:
  - DevOps
description: >-
  Code reviews are crucial to many modern software development processes. However, they are often not done properly. This article will discuss tried and proven approaches to code reviews.
cover:
    image: "/images/posts/code-review.png"
    alt: "Code Review in GitHub"
    caption: "Code Reviews"
---

Code reviews are central to many modern software development processes. However, they are often considered a bother rather than something that can greatly improve code quality. I have been doing code reviews for many years and I have seen many different approaches. In this article, I will discuss the importance of code reviews and how to perform them properly. Obviously, this is a very opinionated post, but I think there is value for anyone interested in doing better code reviews.

## Why perform code reviews?
In short, you should perform code reviews to ensure that the code being delivered is of high quality. Code debt accumulates slowly over time, and eventually, it becomes so large that even trivial changes become challenging. While it is hard to prevent this from happening, code reviews can greatly help reduce code debt and increase overall code quality.

## Who should perform code reviews?
Everyone. However, there is a difference between reviewing code and approving code. The former should be done by everyone, the latter should be done by experienced team members. Note that experience here doesn't only mean years of general experience, but also experience with the codebase and the business domain.

## When to perform code reviews?
Most modern projects use Git or something similar for source control. When an appropriate branching strategy is employed, it allows for new code to be reviewed just before merging back into the primary branch. Ideally, this is done with a Pull or Merge Request. A PR allows for a discussion to take place and for the code to be improved before it is merged. It also allows for the code to be reviewed by multiple people.

Choosing the appropriate branching strategy is outside the scope of this article, but as long as you don't directly commit and push to your primary branch, code reviews can be performed.

## What to look for in code reviews?
This is a very broad question, and the answer will vary from project to project. However, there are some general guidelines that can be followed:

### 1\. Is the change small enough?

The larger the change, the less relevant the review becomes. This is because it is difficult to understand the impact of a large change. It is better to split it into multiple changes. This also allows for each change to be reviewed in parallel.

10 lines of code = 10 issues
500 lines of code = looks good to me

### 2\. Does the code do what it is supposed to do?

The best PR will implement/fix a single change/problem which should be well described in the context of the PR. Typically, binding the PR to a work item tracking software like GitHub, Azure DevOps, or Jira will help with this. The reviewer can then check the intended change against the code.

WTFs/minute is a great metric to measure this. The lower the better.

### 3\. Does the code follow the coding styling rules?

This is a common point of contention. It is rare for people to agree on code styling. While everyone knows that spaces are better than tabs (see what I did here?) not everybody agrees. Jokes aside, there is no right or wrong when it comes to styling. It is important only that a standard is agreed upon and enforced. Code reviews are a great place to enforce code styling.

### 4\. Does the code introduce any security vulnerabilities?

In my experience, this is often the most overlooked aspect of code reviews. Security cannot be a feature; instead, it needs to be treated as a requirement. Every little good practice counts, whether it is a major design aspect or very minor. The goal is to make it as difficult as possible to break into any system. That said, it is very hard to spot security issues, and manual reviews are not good enough. There are tools for this, and I will discuss a few later in this article.

### 5\. Does the code introduce any performance issues?

Another aspect often overlooked in code reviews. Also, another hard-to-manually validate. In general, an experienced reviewer will be able to spot patterns to be avoided and will be able to spot potential performance issues. But only by measuring and benchmarking performance can you really be sure that no issues are introduced. In an ideal world, performance tests would be part of the CI/CD pipeline and would be run automatically.

### 6\. Is the change documented appropriately?

Documentation is the bane of every developer. We either put comments in every line of code or not at all. Documentation in this case refers to how well the change is documented. It can be code-level artifacts, wiki entries, or even a changelog. Regardless, as long as the method is agreed upon, it should also be enforced via code reviews.

## How to perform code reviews?
First and foremost, do use a code review tool. Most Git platforms offer this functionality. Examples are GitHub PR, Azure DevOps PR, GitLab Merge Request, etc. The following items are general guidelines I follow myself when reviewing code:

### 1\. Use a checklist

A simple markdown file with a list of items to check. This will help you not forget anything. It will also help you be consistent across reviews. It is also a good idea to have a checklist for the author to go through before submitting the PR. This will help reduce the number of comments and iterations.

### 2\. Do use code comparison

Most code review tools will allow you to compare the changes with the previous version. This is a great way to spot-check the changes to see if they pass the smell check and whether they are in the context of a single change or something unrelated.

### 3\. Be liberal with comments and questions

Comments are a great way to communicate with the author. Questions, suggestions, compliments, or concerns should all become discussion topics in the PR. The more comments you leave, the more the author and yourself will learn, and the better the code will be.

### 4\. Enforce merge rules

- Require at least one approval besides the author.
- Require a build or validation pipeline to pass before merging. At a minimum, it should contain:
   - Build any relevant artifacts
   - Tests are executed (unit, integration, end-to-end, etc.)
- Require all comments to be addressed before merging.
- Require a work item to be associated with the PR (GitHub issue, Azure DevOps work item, Jira ticket, etc.)

Obviously, avoid exceptions to the merge rules as much as possible.

## Automation, Automation, Automation
As mentioned above, there are some things that are hard to spot manually. This is where automation shines. Most Git platforms support automation workflows. For instance, GitHub has GitHub Actions, Azure DevOps has Azure Pipelines, GitLab has GitLab CI/CD, etc. It is fairly common to automate build and unit tests; however, you can leverage these tools to automate other aspects of code reviews. Here are some examples:

### 1\. Lint the code

Start by using a linting tool to catch syntax and style issues early on. Add it to the validation build to ensure that the code change does not introduce any new issues. The choice of linting tool will depend on the language and framework being used. For example, for JavaScript, you can use [ESLint](<https://eslint.org/>).

To see an example, refer to the [sharp-recipe-parser PR Validation GitHub Action](<https://github.com/jlucaspains/sharp-recipe-parser/blob/main/.github/workflows/pr-validation.yml>).

![Example of a lint failure](/images/posts/lint-failure-example.png)

### 2\. Run a code quality tool

Running a code quality tool is one of the best ways to ensure code quality. It's like getting a free code review. There are many options available that perform deep code analysis and identify code smells, bugs, vulnerabilities, and more. The choice of tool will depend on the language and framework being used. For instance, I often use [Sonar Cloud](<https://www.sonarsource.com/products/sonarcloud/>) because it is free for open-source projects.

To see an example, refer to the [sharp-recipe-parser PR Validation GitHub Action](<https://github.com/jlucaspains/sharp-recipe-parser/blob/main/.github/workflows/pr-validation.yml>).

![Code quality results](/images/posts/code-quality-result.png)

### 3\. Run security scans

Ensuring that code changes do not introduce security issues is crucial but also challenging. Using a security scanner can help identify potential issues. Again, there are many options available that are language and framework dependent. A great option for this is [Snyk](<https://snyk.io/>). Like Sonar Cloud, Snyk is free for open-source projects.

![Security scan results](/images/posts/security-scan-result.jpeg)

### 4\. Deploy the code to a test environment

Deploying code from pull requests can be challenging. I only recommend this approach if you have comprehensive end-to-end tests and a test environment that supports slots. This approach, also known as Environment per PR, is powerful as it allows automated tests to provide feedback before a reviewer looks at the code.

To see an example, refer to the [sharp-cooking-web PR Validation GitHub Action](<https://github.com/jlucaspains/sharp-cooking-web/blob/main/.github/workflows/azure-static-web-apps-delightful-flower-0c3edd710.yml>). Every time a pull request is created, it creates a new Azure App Service slot, deploys the code, and runs end-to-end tests. The results are then posted back to the pull request.

![Deployment results](/images/posts/environment-created-example.png)

## Bonus tips
### GitHub
#### 1. Review pull requests with VS Code on the web

The default GitHub PR review experience may not be ideal for everyone. Instead, you can use VS Code to review a pull request. Simply press the dot (**.**) key while viewing a PR, and it will open VS Code on the web, which provides a better experience in my opinion.

![Open VS Code on the web](/images/posts/github-pr-vscode.jpeg)

#### 2. Use a pull request template

A pull request template is a great way to ensure that all relevant information is provided. It can also include a repository-specific checklist for both pull request submitters and reviewers. Follow [GitHub's guide](<https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository>) to create a pull request template.

Example template in markdown:
```markdown
## Describe your changes

## Issue number
#123

## Checklist before requesting a review
- [ ] I have performed a self-review of my code
- [ ] If it is a core feature, I have added thorough tests.
- [ ] Do we need to implement analytics?
- [ ] Will this be part of a product update? If yes, please write one phrase about this update.
```

#### 3. Use code recommendations for quick fixes

Code reviews can sometimes become lengthy due to small recommendations. GitHub has a feature called code recommendations that allows you to quickly suggest changes to the code. The pull request owner can easily accept and commit the changes directly on the web UI. This is a great way to contribute to the pull request and allow for quick fixes.

![PR Recommendation](/images/posts/github-pr-recommendation.png)

### Azure DevOps
#### 1. Pull request template

Azure DevOps also supports PR templates. Follow [Azure DevOps guide](https://docs.microsoft.com/en-us/azure/devops/repos/git/pull-request-templates?view=azure-devops) to create a pull request template.

![PR Template](/images/posts/azuredevops-pull-request-template.png)
*Image credit: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/repos/git/pull-request-templates?view=azure-devops)*

#### 2. Use code recommendations for quick fixes

Similar to GitHub, Azure DevOps allows you to select a portion of code and suggest a change.

![Suggest a change](https://devblogs.microsoft.com/devops/wp-content/uploads/sites/6/2020/03/suggested-changes-2.png)
*Image credit: [Azure DevOps Blog](https://devblogs.microsoft.com/devops/introducing-the-new-pull-request-experience-for-azure-repos/)*

#### 3. Resolve conflicts in the web UI

Although not native to Azure DevOps, you can use the [Resolve Pull Request Conflicts](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.conflicts-tab) extension to resolve conflicts in the web UI. This avoids the need to clone or update the repository locally

![Resolve Conflicts extension](https://ms-devlabs.gallerycdn.vsassets.io/extensions/ms-devlabs/conflicts-tab/3.1.1.103207/1695846835785/marketplace/images/Review.PNG)
*Image credit: [Pull Request Merge Conflict Extension](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.conflicts-tab)*

## Conclusion
If there's one thing to take away from this article, it's this:

1. Code reviews are crucial in software development.
2. Code reviews should involve everyone, but only experienced team members should approve code.
3. Make small changes to facilitate faster and better reviews.
4. Automate as much validation as possible.

I hope you found this article helpful. If you have any questions or comments, please leave them below.

Cheers,
Lucas