---
layout: post
title: "Ephemeral environments with GitHub Codespaces"
date: 2022-12-02
categories:
  - blog
  - DevOps
description: >-
  GitHub Codespaces now offers free plans for everyone. Let's explore its capabilities and compare it to GitPod and Replit we've used in the not-too-distant past.
cover:
    image: "/images/posts/coding-time.jpg"
    alt: "Developer on top of clock"
    caption: "Photo by [Kevin Ku](https://unsplash.com/@ikukevk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

Back in August 2022, I posted about [Ephemeral environments]({{< ref "/posts/2022-08-17-getting-started-ephemeral-environments" >}}) and compared GitPod and Replit. While Codespaces was first made GA in August 2021, making it fairly mature then, there were no free plans yet so I didn't spend any time in it. Fast forward to November 2022, and [GitHub has released free offerings for Codespaces](https://github.blog/changelog/2022-11-09-codespaces-for-free-and-pro-accounts/). As of writing, a free GitHub account can use up to 60 hours for free. It is time to revisit Ephemeral Environments and play with GitHub Codespaces.

Like last time, I will set up an ephemeral environment for my blog and write this blog post in it.

While you can just spin up a standard code space and configure everything needed after it is up and running, it would be a better experience if the environment was ready with the website running. To that end, let's create a configuration file ``.devcontainer/devcontainer.json`` to instruct Codespaces on how to create and configure your Codespace. Codespaces configuration is quite flexible, see the [GitHub Docs](https://docs.github.com/en/codespaces/overview) for detailed information.

First, we need an image to build our codespaces upon. We will use the default image ``mcr.microsoft.com/devcontainers/universal``. It contains several common development tools such as Python, NodeJs, and .NET (see details at [GitHub Docs](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/introduction-to-dev-containers#using-the-default-dev-container-configuration)). While there is no provided image for Hugo yet, there is a [feature for Hugo](https://github.com/devcontainers/features/blob/main/src/hugo/devcontainer-feature.json) that will allow us to use Hugo CLI. You can reference it by adding ``"ghcr.io/devcontainers/features/hugo:1": {}`` under the ``features`` tag of the JSON file.

```json
{
  "image": "mcr.microsoft.com/devcontainers/universal:2",
  "features": {
    "ghcr.io/devcontainers/features/hugo:1": {}
  }
}
```

You can now spin up a Codespace and issue ``hugo`` commands. However, you likely have git submodules for themes and those are not pulled automatically. Let's add a postCreateCommand to our configuration file so submodules are updated:

```json
{
  "image": "mcr.microsoft.com/devcontainers/universal:2",
  "features": {
    "ghcr.io/devcontainers/features/hugo:1": {}
  },
  "postCreateCommand": "git submodule update --init",
}
```

Great, now a ``hugo serve`` will generate and serve the website. However, links will be broken because it by default uses localhost for base URL. Instead of localhost, we want to use the Codespace provided URL which is ``https://[NAME]-[PORT].preview.app.github.dev``. We can get the name from the ``CODESPACE_NAME`` environment variable and by default, Hugo uses port 1313. Thus we can use this command in the VS Code Terminal:

```bash
hugo server -D -F --baseUrl "https://$CODESPACE_NAME-1313.preview.app.github.dev" -liveReloadPort=443 --appendPort=false --bind=0.0.0.0
```

It is tempting to add this command to the devcontainer.json file ``postStartCommand`` but it will not work there. All commands must exit before environment creation is done and ``hugo server`` will not. You can, however, create a VS Code task in ``.vscode/tasks.json`` and set it to run on a folder open like so:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start",
            "type": "shell",
            "command": "hugo server -D -F --baseUrl \"https://$CODESPACE_NAME-1313.preview.app.github.dev\" -liveReloadPort=443 --appendPort=false --bind=0.0.0.0",
            "problemMatcher": [],
            "runOptions": {
                "runOn": "folderOpen"
            }
        }
    ]
}
```

That's it. When you create a Codespace or open an existing one it should be ready for you. Open the Ports tab in the bottom area of VS Code and you should see the forwarded port to your website.

Cheers,

Lucas

P.S. Yes, I did reuse the image from my previous post on Ephemeral environments. Don't blame me, the image was so good I had to...