---
layout: post
title: "Azure Pipeline service principal detail without AD Access"
date: 2023-07-25
categories:
  - DevOps
  - util
description: >- 
  This posts demonstrates how to lookup the Azure Pipeline service principal information without querying Azure AD directly.
cover:
    image: "/images/posts/service-identity.jpg"
    alt: "Identity"
    caption: "Photo by [Brett Jordan](https://unsplash.com/pt-br/@brett_jordan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/D44kHt8Ex14?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

Azure Pipelines are a powerful tool for automating CI/CD workflows, and the AzureCLI task allows you to execute scripts using the Azure CLI. When working with service principals, it's essential to have their client ID, secret, and object ID at hand. While obtaining the client ID and secret is straightforward using the addSpnToEnvironment property, retrieving the object ID can be a bit more challenging. In this blog post, we'll explore a workaround to easily fetch the object ID for your service principal, even if it doesn't have direct read access to Azure AD.

There are a few ways to lookup the object ID. The easiest is to issue an `az ad principal` command:

```powershell
az ad principal --name MyServicePrincipal --query objectId
```

For this command to work, however, it requires read access to Azure AD which is often not granted to service principals. There is a workaround for this though. The Azure Pipeline principal often have contributor role assigned in a subscription, thus, you can lookup that role assignment and pull the object id from there:

However, for this command to work, it requires read access to Azure AD, which is often not granted to service principals. There is a workaround for this. The Azure Pipeline principal often has been assigned the Contributor role in a subscription. Thus, you can look up that role assignment and pull the object ID from there:

```yaml
- task: AzureCLI@2
  displayName: 'Create pipeline principal variables'
  inputs:
    azureSubscription: 'my-azure-subscription' # needs to be authorized with a service principal with Contributor access
    scriptType: pscore
    addSpnToEnvironment: true
    scriptLocation: inlineScript
    inlineScript: |
      # The addSpnToEnvironment variable adds $env:servicePrincipalId and $env:servicePrincipalKey variables
      $clientId = $env:servicePrincipalId
      $clientSecret = $env:servicePrincipalKey
      $objectId = ""

      # Lookup role assignments for the Contributor role for the current subscription
      $roleAssignments = (az role assignment list --role 'Contributor' | ConvertFrom-Json -NoEnumerate)
      
      # Lookup the role assignment for the client id of the current principal
      foreach ($roleAssignment in $roleAssignments) {
          if ($roleAssignment.principalName -eq $clientId) {
              $objectId = $roleAssignment.principalId
              break
          }
      }

      # Optional: create pipeline variables for the client id, client secret, and client object id
      Write-Host "##vso[task.setvariable variable=principalUserClientId;]$clientId"
      Write-Host "##vso[task.setvariable variable=principalUserSecret;issecret=true]$clientSecret"
      Write-Host "##vso[task.setvariable variable=principalUserObjectId;]$objectId"
```

Cheers,

Lucas