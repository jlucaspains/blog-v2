---
layout: post
title: "Releasing Sharp Cred Manager v2-beta 6"
date: 2026-04-19
categories:
  - DevOps
  - security
  - sharp-cred-manager
description: >-
    Sharp Cred Manager v2 Beta6 is out with Azure App Registration secret adn certificate monitoring alongside existing certificate and secret tracking. Learn what's new, what breaking changes to expect, and how to get started at .
cover:
    image: "https://raw.githubusercontent.com/jlucaspains/sharp-cred-manager/refs/heads/main/docs/demo3.png?raw=true"
    alt: "Sharp Cred Manager - app registration dashboard"
    caption: "Sharp Cred Manager - app registration dashboard"
---

On my last post, I have discussed how Sharp Cred Manager now supports managing Azure Key Vault secrets in addition to certificates. Today, I released v2 beta6 version of Sharp Cred Manager which adds the ability to track App Registrations and their secrets and certificates. Originally, this was planned as a future feature, but the momentum on v2 was good and I decided to add it now.

Similarly to the previous version, the general look and feel is preserved, with minor adjustments to display secrets in the dashboard and webhook notifications. Take a peek below:

Dashboard:
![Sharp Cred Manager Certificates Dashboard](https://github.com/jlucaspains/sharp-cred-manager/blob/main/docs/demo.png?raw=true)

![Sharp Cred Manager Secrets Dashboard](https://raw.githubusercontent.com/jlucaspains/sharp-cred-manager/refs/heads/main/docs/demo2.png?raw=true)

![Sharp Cred Manager App Registrations Dashboard](https://raw.githubusercontent.com/jlucaspains/sharp-cred-manager/refs/heads/main/docs/demo3.png?raw=true)

Slack Notification:
![Sharp Cred Manager Slack Notification](https://github.com/jlucaspains/sharp-cred-manager/blob/main/docs/SlackDemo.png?raw=true)

Teams Notification:
![Sharp Cred Manager Teams Notification](https://github.com/jlucaspains/sharp-cred-manager/blob/main/docs/TeamsDemo.png?raw=true)

You can review the full documentation, including a Getting Started guide and Migration Guide, at [Sharp Cred Manager - GitHub](https://github.com/jlucaspains/sharp-cred-manager).

If you want to try out the app, the easiest way is to spin it in a local container:

```bash
# Replace the tenant id, client id, and secret environment variables with Azure credentials with Key Vault Reader role and Application.Read.All. 
# Replace the cert, secret, and app registration variables with appropriate values to track
# You can also run the command in podman
docker run -it -p 8000:8000 \
    --env ENV=DEV \
    --env SITE_1=https://expired.badssl.com/ \
    --env AZUREKEYVAULTCERT_1=https://mykeyvault.vault.azure.net/certificates/my-cert \
    --env AZUREKEYVAULTSECRET_1=https://mykeyvault.vault.azure.net/secrets/my-secret \
    --env APPREGISTRATION_1=00000000-0000-0000-0000-000000000000 \
    --env AZURE_TENANT_ID=00000000-0000-0000-0000-000000000000 \
    --env AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000 \
    --env AZURE_CLIENT_SECRET=<secret> \
    jlucaspains/sharp-cred-manager:v2.0.0-beta6
```

I hope you give Sharp Cred Manager a try.

Cheers,\
Lucas