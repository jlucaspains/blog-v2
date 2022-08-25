---
layout: post
title: "Automated and repeatable Developer Environment setup - winget"
date: 2022-08-25
categories:
  - util
  - DevOps
  - powershell
description: >-
  Hours to minutes: setting up a .NET / Node developer environment from scratch using PowerShell + winget
cover:
    image: "/images/posts/developer-environment2.jpg"
    alt: "Developer Environment"
    caption: "Photo by Pankaj Patel on [Unsplash](https://unsplash.com/@pankajpatel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

Back in March I posted about [Automated and repeatable Environment Setup]({{< ref "/posts/2022-03-07-Developer-environment-setup" >}}). In that version of the environment setup, I used [Chocolatey](https://chocolatey.org/) because it has always been my go-to Windows app installer. However, the latest versions of Windows 10 and 11 comes with [winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) pre-installed. In this post, I will show how to setup a similar developer environment but using winget instead of chocolatey. 

Similarly to the last post, I will focus on a typical .NET + Node developer environment.

## Install winget
Newer versions of Windows 10 and 11 will already have winget installed. If you don't have it, you can install from the [Microsoft Store](https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1?hl=en-us&gl=US).

## Install PowerShell and Terminal
First, let's install [PowerShell 7+](https://github.com/PowerShell/PowerShell) and [Windows Terminal](https://github.com/microsoft/terminal) using winget.

Note that we add ``--accept-source-agreements`` and ``--accept-package-agreements`` options. The former is only needed once to accept the agreeement to use winget repository. The later is used in each package install to accept any agreement required by the package.

Run these commands as admin in either preinstalled Command Prompt or PowerShell:

```cmd
winget install Microsoft.PowerShell -e -h --accept-source-agreements --accept-package-agreements
winget install Microsoft.WindowsTerminal -e -h --accept-package-agreements
```

## Install the apps
From the newly installed Windows Terminal + Powershell 7+ running as an admin, run the remaining commands:

> **NOTE**: for any package, you can use the ``--override`` option to pass in raw arguments to the package installation pipeline.

```powershell
winget install Git.Git -e -h --accept-package-agreements
winget install OpenJS.NodeJS -e -h --accept-package-agreements
winget install Microsoft.VisualStudioCode -e -h --accept-package-agreements
winget install Microsoft.AzureDataStudio -e -h --accept-package-agreements
winget install Microsoft.DotNet.SDK.6 -e -h --accept-package-agreements
winget install JanDeDobbeleer.OhMyPosh -e -h --accept-package-agreements
winget install Postman.Postman -e -h --accept-package-agreements
# use --override to choose the workloads to install from VS2022
winget install Microsoft.VisualStudio.2022.Enterprise -e -h --accept-package-agreements --override "--add Microsoft.VisualStudio.Workload.CoreEditor --add Microsoft.VisualStudio.Workload.Data --add Microsoft.VisualStudio.Workload.Azure --add Microsoft.VisualStudio.Workload.NetWeb --passive --norestart --wait"
```

## Configure oh-my-posh
To ensure the environment variables are all set for oh-my-posh, restart terminal as admin and run the following commands

```powershell
Add-Content -Path $PROFILE -Value 'oh-my-posh --init --shell pwsh --config https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/v$(oh-my-posh --version)/themes/marcduiker.omp.json | Invoke-Expression'
oh-my-posh font install Meslo

# USE AT YOUR OWN RISK, if the file structure changes, this could break your environment
# This will modify the profile settings file to use the downloaded nerd font
$json = Get-Content "$env:LocalAppData\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json" | ConvertFrom-Json
$json.profiles.defaults = @{font = @{face = "MesloLGM NF"}}
$json | ConvertTo-Json -depth 10 | Out-File "$env:LocalAppData\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"
```

## That's it
Using winget is very similar to chocolatey. The primary difference at this moment is in package offering in favor of Chocolatey and the need to install another tool in favor of winget. At this point, both can do the job and they can do it quite well.

Cheers,

Lucas
