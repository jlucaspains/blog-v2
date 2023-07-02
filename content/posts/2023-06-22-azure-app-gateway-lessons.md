---
layout: post
title: "Azure App Gateway - Lessons learned"
date: 2023-06-22
categories:
  - azure
description: >-
  
cover:
    image: "/images/posts/default.jpg"
    alt: ""
    caption: ""
---

Recently, I have spent a lot of time working with Azure Application Gateway and I wanted to share some lessons I have learned.

All of these lessons are applicable to mid 2023. Be careful if visiting this in the future.

## Deployment
### Verbose deployment templates
As described in my previous post [Azure App Gateway Deployment with Bicep]({{< ref "/posts/2023-06-23-azure-app-gateway-deployment" >}}) deploying an publicly visible Application Gateway can be very verbose and requires several components.

### Firewall policy
* If you enable firewall without a policy, you should remove it from the bicep when you add a policy.

### Private Links
* You shall use private links in App Service otherwise there is no point
* DNS entries for private links

## Networking
### Wildcard certificates
* Does not accept wildcard let's encrypt certs
* Both the app and APGW need certificates to use sub-domain validation.

### Google domains
If you are using regular google domains (not google cloud), certs from Google itself or Let's Encrypt are issued with a `.` at the end of the domain name and are essentially useless. The dot is invisible until you add it to a key vault and later try to reference it.

### Client IP lookup
* Client IP addresses may need to be looked up differently because of reverse proxy

## Firewall
### Exclusions
* Avoid as much as possible to exclude rules. The more exclusions, the more risks.

### Avoid...
* Ajax post with json encoded as string sql injection
* Base64 cookies being flagged for SQL Hex encoding
* Posting images as base64 makes the body too large so it fails to parse. Limit is 100kb.

### Review matches frequently
```kusto
AzureDiagnostics
| where ResourceProvider = "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog" and (action_s == "Matched" or action_s == "Blocked")
| order by timeStamp_t desc
```