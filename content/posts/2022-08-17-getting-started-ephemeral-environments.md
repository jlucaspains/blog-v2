---
layout: post
title: "Getting started with Ephemeral environments"
date: 2022-08-17
categories:
  - blog
  - DevOps
description: >-
  Ephemeral environments can simplify the workflow of starting and configuring environments for each projects. There are many options available for this type of setup, in this post we explore Gitpod and Replit.
cover:
    image: "/images/posts/coding-time.jpg"
    alt: "Locks"
    caption: "Photo by [Kevin Ku](https://unsplash.com/@ikukevk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  "
---

Ephemeral developer environments are short-lived and typically serve a single purpose. Perhaps you are away from your development computer or you are working on completely different projects and don't want to "polute" one or the other. For instance, I have a policy of not mixing up work and personal projects. If I am not at home, I typically don't have my blog code or environment setup.

I spent some time working with both [gitpod.io](https://gitpod.io) and [replit.com](https://replit.com/). The goal is to setup my blog environment, write a blog post, and publish it. This post was completely written and published using Gitpod.

## Gitpod
* Pros
  * Very easy to start
  * Easy proxied published website
  * Visual Studio Code editor
* Cons
  * .gitpod.yml does not work well if added after workspace was created
  * Limited free hours (50/month)

See [Getting Started at gitpod.io](https://www.gitpod.io/docs/getting-started#contribute-with-gitpod-badge).

After you signup and login, you will need to create a Workspace and set it up with dependencies. The creation itself is very simple, connect and authorize a GitLab, GitHub, or BitBucket account and pick the repository to create a workspace for. Additionally, dependencies can be installed using a ``.gitpod.yml`` file:

> **IMPORTANT**: Add the ``.gitpod.yml`` file to your repository before you create your workspace. Otherwise, the init command will not run and the dependencies won't be installed by default.

```yml
# Learn more about tasks at https://www.gitpod.io/docs/config-start-tasks/
tasks:
  - init: brew install hugo
    command: hugo server -D -F --baseUrl $(gp url 1313) --liveReloadPort=443 --appendPort=false --bind=0.0.0.0
# List the ports to expose. Learn more https://www.gitpod.io/docs/config-ports/
ports:
  - port: 1313
    onOpen: open-preview
```

## Replit
* Pros
  * Free for most simple workloads
  * Multiplayer collaboration
* Cons
  * Getting the dependencies setup is not simple
  * Somewhat slow
  * No way to manually restart a Repl so you never know when configuration changes were applied

See the [Tutorial at replit.com](https://docs.replit.com/tutorials/overview).

After you signup and login, you will need to create a Repl (same as Gitpod workspace). When prompted, choose to import the Repl from GitHub instead of creating from a template and provide the URL of the repo. This is a key difference as you do not actually need GitHub or git at all for a Repl. When importing a repository, you will also need to select a language so configuration is appropriate. Since Hugo is not available, we can choose HTML, CSS, JS.

After the Repl is created, use the ``Show hidden files`` option under the ellipsis of the Files area and open the ``replit.nix`` file. This is where we configure the Repl dependencies such as Hugo and miniserve:

```
{ pkgs }: {
    deps = [
        pkgs.hugo
        pkgs.miniserve
    ];
}
```

When we click the ``Run`` button, we want to run Hugo command line and serve the files. We can do that by changing the ``.replit`` file. Replace its contents with the following:

```
run = "hugo && miniserve docs --index index.html"
```

It may take a while for the changes to apply, but you should eventually be able to click ``Run`` and see the website hosted on a side panel. You can also just run ``hugo && miniserve docs --index index.html`` in the Shell and wait a few seconds.

## Others
There are other options to explore, but I felt like Gitpod and Replit were the closest matches for me. Specifically, [GitHub Codespaces](https://github.com/features/codespaces) is a good choice for teams already using GitHub and should be able to provide the same features as the options explored here. [CodeSandbox](https://codesandbox.io/) would work well for javascript only projects. Finally, [Github.dev](https://github.dev) is great for quick and small changes where you don't need to spin up the whole project before committing and pushing.

Cheers,
Lucas