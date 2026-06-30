---
layout: post
title: "Using WSL2 for Developer Environment VMs"
date: 2026-05-17
categories:
  - DevOps
description: >-
    Learn how to set up a secure, isolated WSL2 developer environment on Windows — with SSH access, VS Code integration, and optional multi-VM templates.
cover:
    image: "/images/posts/wsl2.png"
    alt: "WSL2 terminal showing a custom Linux developer environment on Windows"
    caption: "Running an isolated Linux dev environment inside Windows with WSL2"
---

In the past, I posted about different ways to create development environments. These were the posts:

* [Automated and repeatable Developer Environment setup]({{< ref "/posts/2022-03-07-Developer-environment-setup" >}})
* [Getting started with Ephemeral environments]({{< ref "/posts/2022-08-17-getting-started-ephemeral-environments" >}})
* [Automated and repeatable Developer Environment setup - winget]({{< ref "/posts/2022-08-25-Developer-environment-setup-winget" >}})
* [Ephemeral environments with GitHub Codespaces]({{< ref "/posts/2022-12-02-ephemeral-environments-with-github-codespaces" >}})

Historically, I have worked heavily on solutions deployed to Linux, either via Cloud PaaS services like Azure Container Apps or AKS. However, my professional workstation has always been Windows. My tooling varies, but I mostly use VS Code and whatever terminal is available. Any AI tooling I use is also typically terminal-based. In this post, I will detail a hybrid approach where the code and tools live in Linux, but the IDE is hosted in Windows. The reasoning for this setup is that my workstation is Windows and powerful enough that leveraging ephemeral cloud environments is not quite necessary.

> NOTE: I've tested these instructions using Windows 11 for the host and Ubuntu or Debian Linux distros. You may need to adjust them accordingly for other distros.

## TL;DR
Use WSL2 in Windows 11, create a WSL VM, disable WSL automount and interop so it is reasonably isolated from the host, and finally connect to it via WSL on the terminal and SSH on VS Code.

## Installing WSL on Host
Follow [official documentation](https://learn.microsoft.com/en-us/windows/wsl/install). But in short:

```powershell
# Run as administrator to install WSL and the required Windows features.
# If [Distro] is not provided, Ubuntu is installed by default.
wsl --install [Distro]
```

After download and install, provide a username and password and you have a basic VM ready to go.

This process will create a `.vhdx` and `.ico` in `c:\Users\username\AppData\Local\wsl\{guid}`. It will also register the distro with WSL to create an actual VM and show it in Windows as an App. Finally, it initializes an account, configures networking with the host, and maps your local drives under `/mnt`.

For an isolated environment, I heavily recommend you prevent the local drive mapping and disable interop with Windows. For instance, if you want to run Claude Code or GitHub Copilot in your new VM with fewer restrictions, allowing it to potentially see your host drives is a bad idea.

## Isolate the VM from Host
In general, I want my VMs to be reasonably isolated from my host. The top 2 changes I do are to prevent WSL from auto-mounting the host drives and stop adding Windows PATH to Linux PATH. To make these changes, modify `wsl.conf` on your VM using `sudo nano /etc/wsl.conf` to add:

```ini
# Prevents fixed drives (i.e. c:\) to be automatically mounted under /mnt
[automount]
enabled=false
 
# Disable launching Windows processes and prevent adding Windows path elements to $PATH env variable
[interop]
enabled=false
appendWindowsPath=false
```

Shutdown the WSL instance with `wsl --terminate <distroName>`. When you open the distro again, it will have the new configuration.

> NOTE: if you do a `ls /mnt/c` the mount will still be there but `ls` will return nothing.

> NOTE 2: you can still access the VM's file system from the Windows host.

## Setup SSH
Given we disabled interop and path sharing, SSH is the best way to connect to the VM from VS Code. On the VM, I typically use `openssh-server` to handle SSH connections. Because you are sharing networking with the host and port 22 is likely already being used by Windows, you should use another port. I like using 2222 and above for each VM.

Install `openssh-server` in the VM:
```bash
sudo apt install openssh-server -y
```

Configure the port to something other than the default 22:
```bash
sudo nano /etc/ssh/sshd_config
# uncomment PORT and set the value to 2222
```

Restart `openssh-server`:
```bash
sudo systemctl restart ssh
```

Now that SSH is set up, access it from your host to setup trust. This will create the `.ssh\config` file which will be used by VS Code later. To connect to the VM from your host, use:

```powershell
ssh user@localhost -p 2222
```

## Use VSCode with SSH
Because we have disabled Windows interop, typing `code .` on your WSL terminal will not work. To connect to your VM using VS Code, first install the extension on your host:

```powershell
# Install the extension
code --install-extension ms-vscode-remote.remote-ssh
# Port is not necessary for VS Code as it will respect Windows .ssh/config
# Connecting for the first time will install and setup VS Code remote server
code --remote ssh-remote+user@host /path-to-remote-folder
```

> NOTE: If you have multiple VMs set up, change the hostname in the `.ssh\config`

## Install oh-my-posh [Optional]
To install oh-my-posh on your VM, follow these steps.

If running a distro that doesn't have curl by default (e.g., Debian), install it:

```bash
sudo apt update
sudo apt install curl
```

Install `unzip`:

```bash
sudo apt install unzip
```

Install oh-my-posh:

```bash
curl -s https://ohmyposh.dev/install.sh | bash -s
```

If needed, add oh-my-posh to your `$PATH`. Then, add oh-my-posh init to `~/.profile` or `~/.bashrc`:

```bash
nano ~/.profile
# eval "$(oh-my-posh init bash)"
```

## Create Multiple VMs [Optional]
I typically keep a template VM for when I change projects but they still have similar tooling requirements. In that case, I want to prepare a VM, keep it as a template and just duplicate it for each project. Using `wsl --install [Distro]` only works when installing a different distro. To duplicate an existing distro, you need to export and import the WSL VM:

```powershell
# Debian is the distro name
wsl --export Debian c:\VMs\Debian.tar

# replace username with your Windows user
# note the folder will be a bit different from other VMs as it will be a name instead of GUID
wsl --import Debian2 c:\Users\username\AppData\Local\wsl\Debian2 c:\VMs\Debian.tar
```

WSL defaults to using root for imported VMs. Once the import is complete, modify the default user:

```powershell
# replace username with the Linux user you created on the copied VM
wsl --manage Debian2 --set-default-user username
```

## Adjust Memory Available to WSL [Optional]
WSL will hold on to memory it allocates. By default, up to 50% of the host RAM can be allocated to the WSL VM. You can either limit it or set the experimental feature `autoMemoryReclaim` to reduce memory issues. To do it, create a `.wslconfig` in your user directory (typically `c:\users\yourname\`) with the following content:

```ini
[wsl2]
memory=8GB

[Experimental]
# options are disabled (default), gradual, and dropCache
autoMemoryReclaim=dropCache
```

For a list of all options, see the docs at [Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)

## SSH without a password
> Update: this section was added on 6/30/2026

In the WSL distro:
```bash
mkdir ~/.ssh
sudo nano /etc/ssh/sshd_config
```

Set:
```
PubkeyAuthentication yes
PasswordAuthentication no
```

In your client machine, the one connecting to WSL:

```powershell
ssh-keygen -t rsa -b 4096
cat $HOME\.ssh\id_rsa.pub | wsl -d DistroName sh -c "cat >> ~/.ssh/authorized_keys"
```

In the WSL distro:
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
sudo systemctl restart ssh
```

When you first connect via Visual Studio Code, it will ask for the key passphrase. It will not ask again after the first time.

Cheers,\
Lucas
