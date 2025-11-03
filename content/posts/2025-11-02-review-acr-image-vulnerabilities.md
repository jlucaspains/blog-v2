---
layout: post
title: "Guide to Azure Container Registry Vulnerability Assessment"
date: 2025-11-02
categories:
  - DevOps
  - Security
  - Azure
description: >-
    A comprehensive guide to identifying, analyzing, and automating the review of container image vulnerabilities in Azure Container Registry using Microsoft Defender for Cloud and Kusto queries
cover:
    image: "/images/posts/ACRCAEVulnerabilities.png"
    alt: "ACR Container Image Vulnerabilities"
    caption: "ACR Container Image Vulnerabilities"
---

Container security is a critical aspect of modern application deployment. Vulnerable container images can expose your applications to serious security risks, making regular vulnerability assessment essential for maintaining a secure infrastructure.

Microsoft Defender for Cloud provides powerful built-in capabilities to scan and assess vulnerabilities in container images stored in Azure Container Registry (ACR). This guide will walk you through the process of identifying vulnerabilities, understanding their impact, and automating the review process using Kusto queries.

## Prerequisites

Before you can effectively monitor container vulnerabilities, you need to configure Microsoft Defender for Cloud properly:

### 1. Enable Microsoft Defender for Cloud

First, ensure [Microsoft Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction) is enabled on your Azure subscription. Defender for Cloud provides the vulnerability assessment capabilities we'll be using throughout this guide.

### 2. Configure the appropriate Defender plan

To scan container images in Azure Container Registry, you need one of the following plans:
- **[Microsoft Defender for Containers](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-containers-introduction)** (recommended): Provides comprehensive container security including vulnerability assessment, runtime protection, and Kubernetes security
- **[Microsoft Defender CSPM](https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-cloud-security-posture-management)**: Includes agentless container vulnerability assessment as part of cloud security posture management

### 3. Enable agentless container vulnerability assessment

Navigate to **Microsoft Defender for Cloud** > **Environment Settings** > **Your Subscription** > **Settings & monitoring** and ensure the **Enables agentless vulnerability assessment for registry images** is enabled.

## Understanding vulnerability data structure

Microsoft Defender for Cloud stores vulnerability assessment results in the [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/overview), which you can query using [Kusto Query Language (KQL)](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/). 

Each vulnerability is stored as a sub-assessment under the main security assessment, containing details about:
- **CVE information**: Common Vulnerabilities and Exposures identifiers and descriptions
- **Affected packages**: Software components with vulnerabilities
- **Severity levels**: Critical, High, Medium, or Low
- **Fix information**: Available patches or version upgrades
- **Image metadata**: Registry, repository, and tag information

## Query ACR image vulnerabilities

Here's a Kusto query to retrieve vulnerability information from your Azure Container Registry:

```kusto
securityresources
| extend tags = properties.additionalData.artifactDetails.tags[0]
| extend artifactDetails = properties.additionalData.artifactDetails
| extend image = strcat(artifactDetails.registryHost, '/', artifactDetails.repositoryName, ':', tags)
| where type == 'microsoft.security/assessments/subassessments'
| where properties.resourceDetails.ResourceName == 'acrmydev001'
| where properties.status.code <> 'Healthy'
| project image, 
  displayName = properties.displayName, 
  cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, 
  severity = properties.additionalData.vulnerabilityDetails.severity, 
  packageName = properties.additionalData.softwareDetails.packageName, 
  version = properties.additionalData.softwareDetails.version, 
  fixedVersion = properties.additionalData.softwareDetails.fixedVersion, 
  lastModifiedDate = properties.additionalData.vulnerabilityDetails.lastModifiedDate
```

> replace `'acrmydev001'` with the name of your Azure Container Registry.

![ACR Image Vulnerabilities](/images/posts/ACRVulnerabilities.png)

## Correlate vulnerabilities with deployed applications

Identifying vulnerabilities is only the first step. Understanding which applications are actively using vulnerable images is crucial for prioritizing remediation efforts. While Microsoft Defender for Cloud provides built-in monitoring for [Azure Kubernetes Service (AKS) clusters](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-kubernetes-introduction), [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/overview) require a custom approach.

### Query vulnerable images in Azure Container Apps

The following query joins vulnerability data with Azure Container Apps to identify active security risks in your deployed applications:

```kusto
securityresources
| extend tags = properties.additionalData.artifactDetails.tags[0]
| extend artifactDetails = properties.additionalData.artifactDetails
| extend image = strcat(artifactDetails.registryHost, '/', artifactDetails.repositoryName, ':', tags)
| join kind=inner (resources
  | where type == 'microsoft.app/containerapps'
  | extend image = tostring(properties.template.containers[0].image)) 
  on `$left.image == `$right.image
| where type == 'microsoft.security/assessments/subassessments'
| where properties.resourceDetails.ResourceName == 'acrmydev001'
| where properties.status.code <> 'Healthy'
| project image, 
  app = name1, 
  displayName = properties.displayName, 
  cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, 
  severity = properties.additionalData.vulnerabilityDetails.severity, 
  packageName = properties.additionalData.softwareDetails.packageName, 
  version = properties.additionalData.softwareDetails.version, 
  fixedVersion = properties.additionalData.softwareDetails.fixedVersion, 
  lastModifiedDate = properties.additionalData.vulnerabilityDetails.lastModifiedDate
```

> replace `'acrmydev001'` with the name of your Azure Container Registry.

![ACR Container Image Vulnerabilities](/images/posts/ACRCAEVulnerabilities.png)

## Automating vulnerability monitoring

Regular monitoring of container vulnerabilities is essential for maintaining security. You can automate this process using [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/) and [GitHub Actions](https://docs.github.com/en/actions) to run scheduled vulnerability assessments.

### Setting up automated monitoring with GitHub Actions

Here's a GitHub Actions workflow that monitors ACR vulnerabilities nightly:

```yaml
 on:
   schedule:
     - cron: "0 0 * * *"

name: AzureCLISample

jobs:

  build-and-deploy:
    runs-on: ubuntu-latest
    steps:

    - name: Azure Login
      uses: azure/login@v2
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Azure CLI script
      uses: azure/cli@v2
      with:
        azcliversion: latest
        inlineScript: |
          query="securityresources | extend tags = properties.additionalData.artifactDetails.tags[0] | extend artifactDetails = properties.additionalData.artifactDetails | extend image = strcat(artifactDetails.registryHost, '/', artifactDetails.repositoryName, ':', tags) | where type == 'microsoft.security/assessments/subassessments' | where properties.resourceDetails.ResourceName == 'acrmydev001' | where properties.status.code <> 'Healthy' | project image, displayName = properties.displayName, cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, severity = properties.additionalData.vulnerabilityDetails.severity, packageName = properties.additionalData.softwareDetails.packageName, version = properties.additionalData.softwareDetails.version, fixedVersion= properties.additionalData.softwareDetails.fixedVersion, lastModifiedDate =properties.additionalData.vulnerabilityDetails.lastModifiedDate" 
          
          results=$(az graph query -q "$query"--output json)
          count=$(echo "$results" | jq -r '.count')
          
          if [[ $count -gt 0 ]]; then
              echo "::error::Found $count security vulnerabilities in container images"
              echo "| Image | App | Vulnerability | Severity | Package | Current Version | Fixed Version | CVE Description |"
              echo "|-|-|-|-|-|-|-|-|"
              echo "$results" | jq -r '.data[] | "| \(.image) | \(.app) | \(.displayName) | \(.severity) | \(.packageName) | \(.version) | \(.fixedVersion // "N/A") | \(.cveDescription // "N/A") |"'
              exit 1
          else
              echo "No Security Vulnerabilities Found"
          fi
```

This workflow logs into Azure, runs the Kusto query to check for vulnerabilities, and fails the job if any are found, providing a initial report.


Cheers,\
Lucas
