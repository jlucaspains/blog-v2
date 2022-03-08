---
layout: post
title: "Automated and repeatable Developer Environment setup"
date: 2022-03-07
categories:
  - util
  - DevOps
  - powershell
description: >-
  Hours to minutes: setting up a .NET / Node developer environment from scratch using PowerShell + Chocolatey
cover:
    image: "/images/posts/developer-environment.jpg"
    alt: "Developer Environment"
    caption: "Photo by Fotis Fotopoulos on [Unsplash](https://unsplash.com/photos/6sAl6aQ4OWI)"
---

First post of 2022 in March? Sorry for that, it took a while to get traction this year.

I have a habit of "starting over" with my development environment once a year at a minimum. That means that I reinstall the OS from scratch and all my tools. This is actually fun and not hard to do at all, but can it be automated? Yes, [powershell](https://github.com/PowerShell/PowerShell) + [chocolatey](https://chocolatey.org/) is a good answer to this.

The goal of this post is very simple. Demonstrate how to setup a .NET / Node developer environment on Windows from scratch.

## Requirements
* Windows based environment
* Have installed [Powershell Core](https://github.com/PowerShell/PowerShell).

## Installing chocolatey
Chocolatey provides a convenient ``install.ps1`` that you can download and install from powershell directly. Note that we check whether chocolatey is already installed before trying to install it again.

```powershell
# Run this command in PowerShell as Admin.
$isChocoInstalled = choco -v

# Download and install Chocolatey from provided install.ps1
if (-not($isChocoInstalled)) {
  Write-host "Chocolatey is not installed, installation begin now " -ForegroundColor Green
  Set-ExecutionPolicy Bypass -Scope Process -Force;
  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
  Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
} else {
  Write-host "Chocolatey $isChocoInstalled is already installed" -ForegroundColor Green
}
```

## It takes one script
> packages available at chocolotey are not always officially supported. Use at your own risk.

To be honest I had written this post very long with step-by-step instructions. However, nearly everything can be achieved by the script below. Why complicate it?

Note that you can define the version to install. If you'd rather just install latest version available, remove the version parameter.

Another important thing to notice is that you may pass parameters to the visual studio 2022 professional package. See the list of parameters at [VS Docs](https://docs.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2022);

```powershell
# Run this command in PowerShell as Admin.
$isChocoInstalled = choco -v

if (-not($isChocoInstalled)) {
  Write-host "Chocolatey is not installed, installation begin now " -ForegroundColor Green
  Set-ExecutionPolicy Bypass -Scope Process -Force;
  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
  Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
} else {
  Write-host "Chocolatey $isChocoInstalled is already installed" -ForegroundColor Green
}

choco install git --version 2.35.1.2 -y
choco install nodejs-lts --version 16.14.0 -y
choco install vscode --version 1.65.0 -y
choco install azure-data-studio --version 1.35.0 -y
choco install dotnet-6.0-sdk --version 6.0.200 -y
choco install visualstudio2022professional --version 117.1.0.0 -y # you should select the appropriate VS version
choco install microsoft-windows-terminal
```

## Bonus 1 - oh-my-posh
I just love how [oh-my-posh](https://ohmyposh.dev/docs/windows) makes your prompt look great and provide additional contextual information.

```powershell
choco install oh-my-posh

Add-Content -Path $PROFILE -Value 'oh-my-posh --init --shell pwsh --config https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/v$(oh-my-posh --version)/themes/marcduiker.omp.json | Invoke-Expression'
```

## Bonus 2 - authenticated proxy for npm and git

> Do change the user, password, proxy address, and port in the commands belwo

Proxies are some of the most annoying things to deal with in the corporate world. But if they are required, here is how you can set it up too.

```powershell
git config --global http.proxy http://user:url_encoded_password@proxy.company.com:8000/
npm config set proxy http://user:url_encoded_password@proxy.company.com:8000/
```

## Everything together
The following script represents my typical environment. Your needs may vary so it is a good idea to browse [Chocolatey](https://community.chocolatey.org/packages) for other packages that are more applicable to you.

```powershell
# Run this command in PowerShell as Admin.

# Install choco utility
$isChocoInstalled = choco -v

# Download and install Chocolatey from provided install.ps1
if (-not($isChocoInstalled)) {
  Write-host "Chocolatey is not installed, installation begin now " -ForegroundColor Green
  Set-ExecutionPolicy Bypass -Scope Process -Force;
  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
  Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
} else {
  Write-host "Chocolatey $isChocoInstalled is already installed" -ForegroundColor Green
}

# Install git, node, vs code, visual studio, azure data studio, dotnet SDK, and windows terminal
choco install git
choco install nodejs-lts
choco install vscode
choco install azure-data-studio
choco install dotnet-6.0-sdk
choco install visualstudio2022professional --package-parameters "--add Microsoft.VisualStudio.Workload.CoreEditor --add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetCoreTools --add Microsoft.VisualStudio.Workload.NetCrossPlat --add Microsoft.VisualStudio.Workload.NetWeb --passive --norestart --wait"
choco install microsoft-windows-terminal

# install and configure oh-my-posh
choco install oh-my-posh
Add-Content -Path $PROFILE -Value 'oh-my-posh --init --shell pwsh --config https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/v$(oh-my-posh --version)/themes/marcduiker.omp.json | Invoke-Expression'

# set git and npm proxy configuration
git config --global http.proxy http://user:url_encoded_password@proxy.company.com:8000/
npm config set proxy http://user:url_encoded_password@proxy.company.com:8000/
```

## Alternatives
This approach works well if you have a reasonably stable environment. That is, you don't hop between very different solutions too often. If you do change scopes often, a hosted environment might be a better choice for you. That is a subject for another post, but you can get started by checking the solutions below:

* [GitHub Codespaces](https://github.com/features/codespaces)
* [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)