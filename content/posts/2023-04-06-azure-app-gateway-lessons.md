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

Recently, I have spent a lot of time working with Azure Application Gateway and I wanted to share some lessons I have learned.

All of these lessons are applicable to early 2023. Be careful if visiting this in the future.

## Deployment
* Can be very verbose.
* Key Vault - usr identity only
* If you enable firewall without a policy, you should remove it from the bicep when you add a policy.
* You shall use private links in App Service otherwise there is no point
* DNS entries for private links

## Networking and certificates
* Does not accept wildcard let's encrypt certs
* Client IP addresses may need to be looked up differently because of reverse proxy
* Multi-tenant funkyness in App Gateway

## Firewall
* Avoid as much as possible to exclude rules. The more exclusions, the more risks.
* Ajax post with json encoded as string sql injection
* Base64 cookies being flagged for SQL Hex encoding
* Posting images as base64 makes the body too large so it fails to parse. Limit is x bytes.
* You shall review the matched rules:
```kusto
AzureDiagnostics
| where ResourceProvider = "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog" and (action_s == "Matched" or action_s == "Blocked")
| order by timeStamp_t desc
```