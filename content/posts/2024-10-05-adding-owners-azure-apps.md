---
layout: post
title: "Bulk Adding Owners to Azure App Registrations and Enterprise Apps with AZ CLI"
date: 2024-10-05
categories:
  - azure
  - powershell
description: >-
    Learn how to efficiently add owners to Azure App Registrations and Enterprise apps using a simple PowerShell script for automation.
cover:
    image: "/images/posts/owner-key.jpg"
    alt: "Handing down the keys"
    caption: "Photo by [Kelly Sikkema](https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/gray-key-Nel8STCcWy8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
  "
---

Managing multiple Azure App Registrations and Enterprise apps can be overwhelming, especially when you need to add owners manually. To save time, I’ve created a PowerShell script that lets you bulk add owners to Azure App Registrations and Enterprise apps. This is useful when you have a list of users to assign as owners across several apps.

> **VERY IMPORTANT SECURITY NOTICE**: adding owners to app registrations and enterprise apps is a risky operation. Owners have complete control over the app, including modifying it, changing secrets, adding other owners, and deleting it. Ensure you only add trusted users as owners. Use the scripts from this post at your own risk.

### Prerequisites
Before running the script, ensure you have the necessary privileges to manage app registrations and enterprise apps. You must have one of the following roles:

* Cloud Application Administrator
* Application Administrator

You can also modify app registrations that you are already an owner of.

### Collecting the Required Data
To use the script, you’ll need the following information:

1. User Object IDs: Get the object IDs of the users you want to add as owners.
2. App Registration Object IDs: Collect the object IDs of the app registrations. This is different from the client ID.
> Pro Tip: You can get the app registrations with one of the following Azure CLI commands:
>```powershell
># get all app registrations
>az ad app list --query "[].{name:displayName, objectId:id}"
># search by display name (contains is not supported)
>az ad app list --query "[].{name:displayName, objectId:id}" --filter "startswith(displayName, 'myapp')"
>```
3. Enterprise App Object IDs: Gather the object IDs of the enterprise apps you want to add owners to.
> Pro Tip: Use one of the following commands to retrieve the enterprise apps:
>```powershell
># get all enterprise apps
>az rest --method get --url "https://graph.microsoft.com/v1.0/servicePrincipals?\`$select=id,displayName"
># search display name contains myapp
>az rest --method get --url "https://graph.microsoft.com/v1.0/servicePrincipals?\`$search='displayName:myapp'\`$select=id,displayName"
>```

### Adding Owners to App Registrations
> Note: If a user is already an owner, no error will be shown.

Here’s the PowerShell script to bulk add owners to app registrations:

```powershell
# Add only the object id of each user
$users = @("d1f5e8a4-3b4e-4b8d-9f1a-2b3e4c5d6f7", "a2c3d4e5-f6b7-8c9d-0a1b-2c3d4e5f6b7a", "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e")
# Add only the object id of each app registration
$apps = @("c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f",
    "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
    "e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b",
    "a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d",)

az login

# loop through the users
foreach ($app in $apps) {
    foreach ($user in $users) {
        # loop through the apps
        az ad app owner add --id $app --owner-object-id $user
    }
}
```

### Adding Owners to Enterprise Apps
> Note: If a user is already an owner, the script will return:
> "One or more added object references already exist for the following modified properties: 'owners'."

Unlike App Registrations, there isn't a direct Azure CLI command to add owners to Enterprise Apps. Instead, you’ll need to use a REST request to the Microsoft Graph API. For convenience, you can still use the Azure CLI's `az rest` command, which automatically handles authorization by including the necessary token. Here’s a script to add multiple users to multiple Enterprise Apps:

```powershell
# Add only the object id of each user
$users = @("f8e9d0c1-b2a3-4d5e-6f7a-8b9c0d1e2f3a", "e7d8c9b0-a1b2-3c4d-5e6f-7a8b9c0d1e2f", "d6c7b8a9-0b1c-2d3e-4f5a-6b7c8d9e0f1a")
# Add only the object id of each enterprise app
$apps = @("c5b6a7d8-9e0f-1a2b-3c4d-5e6f7a8b9c0d",
"b4a5d6c7-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
"a3b4c5d6-7e8f-9a0b-1c2d-3e4f5a6b7c8d",
"9f0e1d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f",)

# loop through the users
foreach ($app in $apps) {
    foreach ($user in $users) {
        # loop through the apps
        $postBody = "{\""@odata.id\"": \""https://graph.microsoft.com/v1.0/directoryObjects/$user\"" }"
        az rest -m POST --url "https://graph.microsoft.com/v1.0/servicePrincipals/$app/owners/`$ref" -b $postBody --headers "Content-Type=application/json"
    }
}
```

### Conclusion
Adding owners to multiple Azure App Registrations and Enterprise Apps can be time-consuming. By using the PowerShell scripts above, you can save time and effort. Remember to replace the object IDs with the actual values before running the scripts.

Cheers,\
Lucas