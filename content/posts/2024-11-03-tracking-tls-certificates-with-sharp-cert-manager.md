---
layout: post
title: "How to track TLS certificates with Sharp Cert Manager and Azure Container App Jobs"
date: 2024-11-03
categories:
  - util
  - sharp-cert-manager
description: >-
    Learn how to automate TLS certificate monitoring using sharp-cert-manager and Azure Container App Jobs to prevent unexpected expirations, avoid downtime, and receive proactive notifications.
cover:
    image: "/images/posts/sharp-cert-manager-teams-notification.png"
    alt: "Sharp Cert Manager with Azure Container App Jobs"
    caption: "Sharp Cert Manager with Azure Container App Jobs"
---

Few things are worse than discovering a TLS certificate has expired without warning. Expired certificates can lead to unexpected downtime, loss of customer trust, and plenty of frustration. To avoid these problems, it’s essential to keep track of your certificates and renew them ahead of time. 

While many rely on calendar reminders to manage this, manual tracking often isn’t enough. Automating the process is a far more reliable solution.

In this post, I'll show you how to automate TLS certificate monitoring using [sharp-cert-manager](https://github.com/jlucaspains/sharp-cert-manager) with [Azure Container App Jobs](https://learn.microsoft.com/en-us/azure/container-apps/jobs?tabs=azure-cli).

## Why Use sharp-cert-manager?

**sharp-cert-manager** is an open-source, container-based tool that makes managing TLS certificates straightforward. It can run as a web server that reviews certificates on request, or as a scheduled job that monitors your certificates and notifies you before they expire. This makes it an excellent addition to any DevOps toolkit.

## Why Choose Azure Container App Jobs?

**Azure Container App Jobs** is a fully managed service that runs containerized workloads in the cloud. It's ideal for scheduled tasks, such as running sharp-cert-manager, because it's easy to set up, manage, and cost-effective. You only pay for the time the job is running. For instance, monitoring a few certificates weekly could cost just pennies, or often nothing, over a year.

## Setting Up sharp-cert-manager on Azure Container App Jobs

Let's walk through the setup process, starting with the creation of an Azure Container Environment.

### Step 1: Create a New Azure Container Environment

Run the following command to create a new environment in Azure. Remember to change the resource group, resource name, and location to match your environment:

```bash
az containerapp env create -n ace-sharpcertmanager-scus-001 `
    -g rg-sharpcertmanager-soutchcentralus-001 `
    --location southcentralus `
    --logs-destination none
```

### Step 2: Create the Azure Container Job
Next, create the Azure Container Job to run sharp-cert-manager. Before running the command below, update the resource group, resource name, environment name, the list of sites to monitor, and the webhook URL for notifications. For a full list of options, see the sharp-cert-manager documentation.

This configuration will set up a weekly job that notifies you in Teams about your certificates' statuses, similar to the example below:

```bash
az containerapp job create `
    --name "acj-sharpcertmanager-scus-001" `
    --resource-group "rg-sharpcertmanager-soutchcentralus-001" `
    --environment "ace-sharpcertmanager-scus-001" `
    --trigger-type "Schedule" `
    --replica-timeout 1800 `
    --image jlucaspains/sharp-cert-manager:latest `
    --cpu "0.25" --memory "0.5Gi" `
    # scheduled jobs run using UTC time zone.
    --cron-expression "0 0 * * 1" `
    --replica-retry-limit 1 `
    --parallelism 1 `
    --replica-completion-count 1 `
    --env-vars ENV=DEV `
SITE_1=https://blog.lpains.net/ `
CERT_WARNING_VALIDITY_DAYS=90 `
HEADLESS=true `
WEBHOOK_TYPE=teams `
WEBHOOK_URL=https://webhook.site/f6b9e11c-07af-411b-ae8b-79611d33913e `
MESSAGE_MENTIONS=me@lpains.net `
CHECK_CERT_JOB_NOTIFICATION_LEVEL=Info
```

### Step 3: Job execution
With the setup complete, the job will run weekly at midnight UTC, checking the certificates for the specified sites and sending notifications to the specified webhook URL. The teams message should look like this:

![sharp-cert-manager teams notification](/images/posts/sharp-cert-manager-teams-notification.png)

### Managing Costs
If you’re concerned about costs, Azure offers free usage for Azure Container Apps, including up to 180,000 vCPU seconds and 360,000 GiB seconds per month (as of November 2024). This should cover the cost of running this monitoring job for free in many cases.

By following these steps, you can automate TLS certificate tracking, saving time and avoiding the headaches associated with unexpected expirations.

Cheers,\
Lucas