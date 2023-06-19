---
layout: post
title: "Azure App Gateway - Lessons learned"
date: 2023-04-06
categories:
  - azure
description: >-
  
cover:
    image: "/images/posts/default.jpg"
    alt: ""
    caption: ""
---

All of these lessons are applicable to early 2023. Be careful if visiting this in the future.

## Deployment with bicep
* Very long
* Key Vault - usr identity only 
* If you enable firewall without a policy, you should remove it from the bicep when you add a policy.

## App gateway and certificates
* Does not accept let's encrypt certs
* IP addresses may need to be looked up differently because of reverse proxy
* You shall use private links in App Service otherwise there is no point
* DNS entries for private links
* Multi-tenant funkyness in App Gateway

## Firewall
* Avoid as much as possible to exclude rules
* Ajax post with json encoded as string sql injection
* Base64 cookies being flagged for SQL Hex encoding
* Posting images as base64 makes the body too large so it fails to parse. Limit is x bytes
* You shall review the matched rules:
```kusto
AzureDiagnostics
| where ResourceProvider = "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog" and (action_s == "Matched" or action_s == "Blocked")
| order by timeStamp_t desc
```