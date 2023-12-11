---
layout: post
title: "Introducing azdiff: Simplifying Azure Environment Comparison"
date: 2023-11-28
categories:
  - DevOps
  - Azure
description: >-
    azdiff offers a simple way to compare Azure environments.
cover:
    image: "/images/posts/azdiff-example.png"
    alt: "azdiff"
    caption: "azdiff"
---

In the realm of cloud infrastructure, Azure offers a robust framework for managing resources through Infrastructure as Code (IaC) methodologies. However, even with the best IaC practices in place, managing and understanding changes across Azure app environments can be a daunting task. This is where the azdiff tool steps in to simplify the comparison process.

azdiff is a dotnet global tool, thus, you will need .NET 8 or higher installed. To install azdiff, run the following command:

```powershell
dotnet tool install --global lpains.azdiff --prerelease
```

Where azdiff shines is that it doesn't simply compare the templates, rather, it will match resources by type and name accross environments and individually compare them. This greatly enhances the results compared to using a compare tool like VS Code or something similar.

The tool is capable of comparing resources in two ARM templates. You can either export the template files for comparison, or have the tool export the template for you. The latter is the recommended approach as it will ensure the template is up to date.

To compare 2 template files, run the following command:

```powershell
azdiff arm --sourceFile .\source.json `
           --targetFile .\target.json
```

To directly compare 2 resource groups, run the following command:

```powershell
azdiff rg --sourceResourceGroupId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-dev-001 `
          --targetResourceGroupId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-test-001
```

The tool also offers flexible options to enhance accuracy. Users can specify certain resource types to ignore during comparisons and replace specific strings, mitigating false positives. For instance, easily replace environment-specific names (e.g., dev, test, prod) with a unified string (e.g., env) for more precise comparisons. Explore the completedocumentation in [the repository](https://github.com/jlucaspains/azdiff).

Either way, the tool will output a `.diff` file per resource compared. The output will be similar to the example below:

```diff
  {
    "type": "Microsoft.Web/staticSites",
    "apiVersion": "2023-01-01",
    "name": "stapp-blog-centralus-001",
    "location": "Central US",
    "sku": {
      "name": "Free",
      "tier": "Free"
    },
    "properties": {
      "repositoryUrl": "https://github.com/jlucaspains/blog-v2",
-     "branch": "v1",
+     "branch": "release/v1",
      "stagingEnvironmentPolicy": "Enabled",
      "allowConfigFileUpdates": true,
      "provider": "GitHub",
      "enterpriseGradeCdnStatus": "Disabled"
    }
  }
```

azdiff is currently in beta so feedback is welcome. Feel free to open an issue or a PR at [the repository](https://github.com/jlucaspains/azdiff).

Cheers,\
Lucas