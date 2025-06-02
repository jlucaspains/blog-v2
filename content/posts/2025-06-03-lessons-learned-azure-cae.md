---
layout: post
title: "Lessons learned on Azure Container Apps"
date: 2025-06-03
categories:
  - azure
  - containers
description: >-
    TBD.
cover:
    image: ""
    alt: "TBD"
    caption: "TBD"
---

1. There are 2 versions of CAE: Consumption only and Workload profiles.
   1. UDR is only supported in Workload profiles.
2. Consumption plans apps restart often. Use dedicated plans for production workloads.
3. Azure Functions in CAE can be created in two ways. Using function app CLI or container app CLI.
   1. Scale to 0 capability
4. You can't directly create a probe via CLI `az containerapp create/update` commands.
5. When creating a container app via yaml, you cannot use system identity to pull images.
6. Container app jobs are a great way to run scheduled tasks.
7. If logs are not getting saved to Log Analytics, you may need to create a new LAW resource.
8. Be careful with liveness probe as it may restart your app on failures.
   1. Only replace default in very specific situations.
9.  Do not use ingress for internal app communication.

Cheers,\
Lucas