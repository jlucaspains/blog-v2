---
layout: post
title: "Getting start with Ephemeral environments"
date: 2022-08-17
draft: true
categories:
  - blog
  - DevOps
description: >-
  TBD
cover:
    image: "/images/posts/ephemeral.jpg"
    alt: "Locks"
    caption: "Photo by [Parsoa Khorsand](https://unsplash.com/@parsoakhorsand?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/lock?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  "
---

Ephemeral developer environments are typically short-lived and serve a single purpose. Perhaps you are away from your development computer or you are working on completely different projects and don't want to "polute" one or the other. For instance, I have a policy of not mixing up work and personal environments. If I am not at home, I typically don't have my blog code or environment setup.

I spent some time working with both [gitpod.io](https://gitpod.io) and [replit.com](https://replit.com/). The goal is to setup my blog environment, write a blog post, and publish it.

## Gitpod
* Pros
  * Very easy to start
  * Easy proxied published website
* Cons
  * .gitpod.yml does not seem to work well if added after workspace was created

After you signup and login, you will need to create a Workspace and set it up with dependencies. Dependencies can be installed using a ``.gitpod.yml`` file:

```yml
# List the start up tasks. Learn more https://www.gitpod.io/docs/config-start-tasks/
tasks:
  - init: brew install hugo
    command: hugo server -D -F --baseUrl $(gp url 1313) --liveReloadPort=443 --appendPort=false --bind=0.0.0.0
# List the ports to expose. Learn more https://www.gitpod.io/docs/config-ports/
ports:
  - port: 1313
    onOpen: open-preview
```



## Replit