---
layout: post
title: "Streamlining App Role Setup with Azure Entra: A Step-by-Step Guide"
date: 2024-04-07
categories:
  - util
description: >-
    This step-by-step guide outlines the process of setting up app registrations, defining app roles, and binding them to security groups, simplifying the management of access control across various environments.
cover:
    image: "/images/posts/enterprise-app-roles-qa.png"
    alt: "App role assignment to Azure Entra security groups"
    caption: "App role assignment to Azure Entra security groups"
---

Role-based authorization is crucial for controlling access to resources in many applications. When integrating Azure Entra for authentication, leveraging its built-in app roles capability is a common approach. However, managing role assignments for multiple apps across various environments can be tedious. For instance, a scenario with three apps, three roles, and three environments would require 27 role assignments. This post explores automating the process of adding roles to Azure Entra app registrations primarily using the Azure CLI.

## Setting Up App Registrations
Let's start by creating the necessary app registrations. We'll work with two apps (People API and Order API) across two environments (dev and qa), each with three roles (Administrator, Developer, and User), resulting in a total of 12 role assignments.

{{< gist jlucaspains 8cbcb641a5ebc40a027956f94127f0a7 CreateAppRegs.ps1 >}}

Additionally, we'll configure the app registration with the required API permissions using the following JSON file:

{{< gist jlucaspains 8cbcb641a5ebc40a027956f94127f0a7 appApi.json >}}

## Creating App Roles and Binding Security Groups
Once the app registrations are set up, the next step is to define and bind app roles. We'll start by specifying the roles in a JSON file:

{{< gist jlucaspains 8cbcb641a5ebc40a027956f94127f0a7 appRoles.json >}}

A few important notes:

1. The order of roles is arbitrary.
2. Role IDs must be unique within a single app but can repeat accross apps.
3. Existing roles won't be deleted by the script.

Then, we execute the following script to complete the setup:

{{< gist jlucaspains 8cbcb641a5ebc40a027956f94127f0a7 SetupAppRoles.ps1 >}}

This script performs the following tasks:

1. Iterates through defined apps and environments.
2. Determines a unique list of roles for each app.
3. Identifies Azure Entra security groups to bind to each app role.
4. Creates role assignments between app roles and security groups using the Microsoft Graph API due to the limitation of the Azure CLI.

## Final Outcome
1. App registrations for each environment-app combination.

![App registrations](/images/posts/app-regs.png)

2. Enterprise apps corresponding to each app registration.

![Enterprise apps](/images/posts/enterprise-apps.png)

3. App roles created and assigned to each app registration.

![App registration app roles](/images/posts/app-reg-roles.png)

4. Enterprise apps with role assignments to Azure Entra groups.

DEV app
![Enterprise app role assignment DEV](/images/posts/enterprise-app-roles-dev.png)

QA app
![Enterprise app role assignment QA](/images/posts/enterprise-app-roles-qa.png)

Cheers,\
Lucas