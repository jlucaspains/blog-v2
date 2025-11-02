---
layout: post
title: "Review ACR image vulnerabilities"
date: 2025-10-29
categories:
  - DevOps
description: >-
    TBD
cover:
    image: "/images/posts/TBD.png"
    alt: "TBD"
    caption: "TBD"
---

Reviewing container image vulnerabilities in Azure Container Registry (ACR) can be crucial for maintaining the security of your applications. Azure Microsoft Defender for Cloud provides built-in assessments that help identify vulnerabilities in container images stored in ACR. In this post, I'll share Kusto queries that can be used to review ACR image vulnerabilities and how to integrate this information with Azure Container Apps (ACA) usages.

## Prerequisites
1. Enable [Microsoft Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction) on your Azure subscription.
2. Make sure that the Agentless container vulnerability assessment extension is set to On. This can be done via the Azure Portal.
   1. If you don't see the setting, upgrade Microsoft Defender for Cloud to Defender CSPM plan, Defender for Containers plan or Defender for Container Registries plan.

## Review ACR Image Vulnerabilities

Below is a Kusto query that can be used to review ACR image vulnerabilities.

```kusto
securityresources
| extend tags = properties.additionalData.artifactDetails.tags[0]
| extend artifactDetails = properties.additionalData.artifactDetails
| extend image = strcat(artifactDetails.registryHost, '/', artifactDetails.repositoryName, ':', tags)
| where type == 'microsoft.security/assessments/subassessments'
| where properties.resourceDetails.ResourceName == 'acrmydev001'
| where properties.status.code <> 'Healthy'
| project image, displayName = properties.displayName, cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, severity = properties.additionalData.vulnerabilityDetails.severity, packageName = properties.additionalData.softwareDetails.packageName, version = properties.additionalData.softwareDetails.version, fixedVersion= properties.additionalData.softwareDetails.fixedVersion, lastModifiedDate =properties.additionalData.vulnerabilityDetails.lastModifiedDate
```

## Integrate with Azure Container Apps
While it is important to identify vulnerabilities in ACR images, it is equally crucial to understand which apps are utilizing these vulnerable images. Defender for Cloud monitors AKS clusters directly, but for Azure Container Apps, we need to join the image vulnerability data with ACA resources and current app configurations to find active vulnerabilities. Note that the query below is using the first tag of the image to match with the ACA image. Your may need to adjust the query for your scenario.

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
| project image, app = name1, displayName = properties.displayName, cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, severity = properties.additionalData.vulnerabilityDetails.severity, packageName = properties.additionalData.softwareDetails.packageName, version = properties.additionalData.softwareDetails.version, fixedVersion= properties.additionalData.softwareDetails.fixedVersion, lastModifiedDate =properties.additionalData.vulnerabilityDetails.lastModifiedDate
```

## Nightly Automation with Azure CLI
To automate the review process, you can run the Kusto query using Azure CLI's `az graph` command and GitHub Actions. Below is an example of how to execute the query:

```yaml
on: [push]

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
          else
              echo "No Security Vulnerabilities Found"
          fi
```


Cheers,\
Lucas
