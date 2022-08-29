---
layout: post
title: "Setting up Hyper-V VM using powershell"
date: 2022-08-28
categories:
  - util
  - DevOps
  - powershell
description: >-
  If you are one of those that need to frequently create VMs based on a template, keep reading, I got PowerShell automation for you.
cover:
    image: "/images/posts/developer-vm.jpg"
    alt: "Developer VM"
    caption: "Photo by İsmail Enes Ayhan on [Unsplash](https://unsplash.com/photos/lVZjvw-u9V8)"
---

It is not uncommon in consulting to work out of dedicated VMs for each customer. This helps create a strong segregation between internal and each client workstream. If you use Hyper-V, chances are that you already have a template VM and use copies of it, so you don't setup everything over and over. In this post, I will do exactly that, but introduce as much automation using PowerShell as possible.

> **IMPORTANT**: All commands shown from now on are to be executed in PowerShell in the host computer as Admin.

## 1. Installing Hyper-V
The following command will install Hyper-V along with the PowerShell module for Hyper-V management. You may need to restart your computer before you can proceed to next steps.

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

## 2. Creating the template VM
We have 2 options here. You can either DYI or you can use MS starting VM template.

### 2.1 DYI
The advantage of DYI is customization. You can use Windows 10 or 11 or even older versions. Also, your copy of windows will be very clean. The disadvantage is, you have to do it all yourself and there is no easily automated way to get through Windows installation and initial setup.

Before starting, you will need a windows installation file as an ``.iso``. You can download that from [MSDN](https://my.visualstudio.com) if you have a license. 

This script will create the VM, its disk, and bind the iso as a DVD drive. When started, the VM will automatically start windows installation.

```powershell
$VMName = "Win11Template" # you may have multiple template VMs, just ensure they have a good name
$Switch = "Default Switch" # The default switch will use NAT and allow the VM to talk to the internet by default
$InstallMedia = "C:\VMs\Win11_x64_BUS_21H2.iso" # the windows install media
$VMRootPath = "c:\VMs"

# The VM will use the default switch defined above
New-VM -Name $VMName -MemoryStartupBytes 8GB -Generation 2 -NewVHDPath "$VMRootPath\$VMName\$VMName.vhdx" -NewVHDSizeBytes 50GB -Path $VMRootPath -SwitchName $Switch

# Add DVD Drive to VM
Add-VMScsiController -VMName $VMName
Add-VMDvdDrive -VMName $VMName -ControllerNumber 1 -ControllerLocation 0 -Path $InstallMedia

# Mount Installation Media (.iso)
$DVDDrive = Get-VMDvdDrive -VMName $VMName

# Configure Virtual Machine to Boot from installation media
Set-VMFirmware -VMName $VMName -FirstBootDevice $DVDDrive

# Start VM
Start-VM $VMName
```

Once the VM starts, finish windows installation, create a local user, and you should be ready to continue preparation in step 3.

### 2.2 MS provided VM
MS already has a win 11 VM (as of August 2022) that you can just download at [developer.microsoft.com](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/). This will be a zip with a ``.vhdx`` file. You still need to create a VM and attach the disk to it:

> **NOTE**: Before you run the powershell below, unzip the ``vhdx`` downloaded and move it to ``c:\VMs\Win11Template`` directory.

```powershell
$VMName = "Win11Template" # you may have multiple template VMs, just ensure they have a good name
$VMRootPath = "c:\VMs"
New-VM -Name $VMName -path $VMRootPath -MemoryStartupBytes 8GB -Generation 2 -VHDPath "$VMRootPath\Win11Template\Win11Template.vhdx"
Start-VM $VMName
```

The caveat of this model is that the VM will have some pre-installed software. For instance, the VM has Visual Studio Community edition which is not applicable to my typical environment.

## 3. License your template VM
Whichever approach you use for creating your base VM, eventually, it will need to be activated. If you have an MSDN, you can get a product key from [my.visualstudio.com](https://my.visualstudio.com/ProductKeys?mkt=en-us) and [activate windows](https://support.microsoft.com/en-us/windows/activate-windows-c39005d4-95ee-b91e-b399-2820fda32227) with it.

> **IMPORTANT** Not all licenses can be used in multiple VM copies. Be careful with how you utilize your license.

## 4. Standard DEV tools
My previous post on [Automated and repeatable Environment Setup - winget]({{< ref "/posts/2022-08-25-Developer-environment-setup-winget" >}}) has good instructions on how to setup your environment using winget which should be provided in win 11 by default.

## 5. Export VM
> **IMPORTANT**: before going further, ensure that everything you need is installed in the template VM.

The Export-VM will basically create a copy of your template that can be easily imported with Import-VM later. If you don't export your VM, you will not be able to import it.

```powershell
$VMRootPath = "c:\VMs"
Export-VM -Name "Win11Template" -Path "$VMRootPath\Template" # the export will not rename the VM, so, use a different folder
```

You may delete your original template VM if you want to save on space. You can always create a new one from the ``.vmcx`` file and make changes to it before exporting again.

## 6. Import the VM as a copy
Importing your VM as a copy will create a new id for it. This way you will be able to import the same ``.vmcx`` many times. Also, you can pipe the import result and rename the VM easily.

```powershell
$VMRootPath = "c:\VMs"
$VMNewName = "Win11Project1"
# Change the guid of the file below to the one generated in Export VM
Import-VM -Path "$VMRootPath\Template\Win11Template\2B91FEB3-F1E0-4FFF-B8BE-29CED892A95A.vmcx" -Copy -GenerateNewId -VirtualMachinePath "$VMRootPath\$VMNewName\" -VhdDestinationPath "$VMRootPath\$VMNewName\" | Rename-VM -NewName $VMNewName 
```

## Bonus tip 1 - full screen resolution
You may have to enable [Enhanced Session](https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/learn-more/use-local-resources-on-hyper-v-virtual-machine-with-vmconnect) in the VM itself.

```powershell
Set-VMhost -EnableEnhancedSessionMode $True
```

## Bonus tip 2 - leave full-screen
Just like VIM, I never remember how to get out of a full-screen session where the remote desktop bar is not available. There are a few ways to get out of this situation:

1. CTRL + ALT + Pause/Break
2. CTRL + ALT + Left Arrow
  * This will only release the mouse pointer from the VM, press windows key to open the start menu on the host computer and then you can minimize or close the remote desktop session.

## What's next?
You may automate the creation of VMs easily. However, whenever possible, I recommend using Ephemeral environments. After initial configuration, you should easily be able to spin up and destroy those environments very easily and they should be reasonably affordable. I have discussed briefly about Ephemeral Environments earlier this month in [Getting started with Ephemeral environments]({{< ref "/posts/2022-08-17-getting-started-ephemeral-environments" >}}).

Cheers,

Lucas
