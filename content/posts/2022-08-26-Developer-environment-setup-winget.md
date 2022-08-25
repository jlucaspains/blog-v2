---
layout: post
title: "Automated and repeatable Developer Environment setup - winget"
date: 2022-08-26
categories:
  - util
  - DevOps
  - powershell
description: >-
  Hours to minutes: setting up a .NET / Node developer environment from scratch using PowerShell + winget
cover:
    image: "/images/posts/developer-environment.jpg"
    alt: "Developer Environment"
    caption: "Photo by Fotis Fotopoulos on [Unsplash](https://unsplash.com/photos/6sAl6aQ4OWI)"
---

Back in March I posted about [Automated and repeatable Environment Setup]({{< ref "/posts/2022-03-07-Developer-environment-setup" >}}). In that version of the environment setup, I used [chocolatey](https://chocolatey.org/) which remains as a good option now. However, the latest versions of Windows 10 and 11 comes with winget pre-installed. In this post, I will show how to setup a similar developer environment but using [winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) instead of chocolatey. 

Similarly to the last post, I will focus on a typical .NET + Node developer environment.

## Install winget
Newer versions of Windows 10 and 11 will already have winget installed. If you don't have it, you can install from the [Microsoft Store](https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1?hl=en-us&gl=US).

## Install powershell
First, let's install PowerShell 7+ using winget.

```cmd
winget install Microsoft.PowerShell
```

## Install the apps
From the newly installed powershell running as an admin, run the remaining commands:

```powershell
winget install Microsoft.VisualStudioCode
winget install Git.Git
winget install OpenJS.NodeJS
winget install Microsoft.AzureDataStudio
winget install Microsoft.DotNet.SDK
winget install Microsoft.WindowsTerminal
winget install JanDeDobbeleer.OhMyPosh
winget install Microsoft.VisualStudio.2022.Enterprise --silent --override "--add Microsoft.VisualStudio.Workload.CoreEditor --add Microsoft.VisualStudio.Workload.Data --add Microsoft.VisualStudio.Workload.Azure --add Microsoft.VisualStudio.Workload.NetWeb --passive --norestart --wait"
winget install Postman.Postman
```

## Configure oh-my-posh
To ensure the environment variables are all set for oh-my-posh, restart powershell and run the following commands

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\marcduiker.omp.json"
oh-my-posh font install Meslo

## USE AT YOUR OWN RISK, if the file structure changes, this could break your environment
$json = Get-Content "$env:LocalAppData\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json" | ConvertFrom-Json
$json.profiles.defaults.font.face = "MesloLGM NF"

$json | ConvertTo-Json -depth 10 | Out-File "$env:LocalAppData\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"
```

