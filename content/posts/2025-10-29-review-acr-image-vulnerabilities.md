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

1. Review ACR Image Vulnerabilities
```kusto
securityresources
| extend tags = properties.additionalData.artifactDetails.tags[0]
| extend artifactDetails = properties.additionalData.artifactDetails
| extend image = strcat(artifactDetails.registryHost, '/', artifactDetails.repositoryName, ':', tags)
| where type == 'microsoft.security/assessments/subassessments'
| where properties.resourceDetails.ResourceName == 'acradobuildstsdev001'
| where properties.status.code <> 'Healthy'
| project image, displayName = properties.displayName, cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, severity = properties.additionalData.vulnerabilityDetails.severity, packageName = properties.additionalData.softwareDetails.packageName, version = properties.additionalData.softwareDetails.version, fixedVersion= properties.additionalData.softwareDetails.fixedVersion, lastModifiedDate =properties.additionalData.vulnerabilityDetails.lastModifiedDate
```

2. Integrate with ACA current usages
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
| where properties.resourceDetails.ResourceName == 'acradobuildstsdev001'
| where properties.status.code <> 'Healthy'
| project image, app = name1, displayName = properties.displayName, cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, severity = properties.additionalData.vulnerabilityDetails.severity, packageName = properties.additionalData.softwareDetails.packageName, version = properties.additionalData.softwareDetails.version, fixedVersion= properties.additionalData.softwareDetails.fixedVersion, lastModifiedDate =properties.additionalData.vulnerabilityDetails.lastModifiedDate
```

3. Running with `az graph`
```bash
az graph query -q "securityresources | extend tags = properties.additionalData.artifactDetails.tags[0] | extend artifactDetails = properties.additionalData.artifactDetails | extend image = strcat(artifactDetails.registryHost, '/', artifactDetails.repositoryName, ':', tags) | where type == 'microsoft.security/assessments/subassessments' | where properties.resourceDetails.ResourceName == 'acradobuildstsdev001' | where properties.status.code <> 'Healthy' | project image, displayName = properties.displayName, cveDescription = properties.additionalData.cveDescriptionAdditionalInformation, severity = properties.additionalData.vulnerabilityDetails.severity, packageName = properties.additionalData.softwareDetails.packageName, version = properties.additionalData.softwareDetails.version, fixedVersion= properties.additionalData.softwareDetails.fixedVersion, lastModifiedDate =properties.additionalData.vulnerabilityDetails.lastModifiedDate" --output json
```

Cheers,\
Lucas
