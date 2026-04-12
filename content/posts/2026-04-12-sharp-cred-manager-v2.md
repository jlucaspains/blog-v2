---
layout: post
title: "Releasing Sharp Cred Manager v2"
date: 2026-04-12
categories:
  - DevOps
  - security
  - sharp-cred-manager
description: >-
    Sharp Cred Manager v2 is out with Azure Key Vault secret monitoring alongside existing certificate tracking. Learn what's new, what breaking changes to expect, and how to get started with Docker.
cover:
    image: "https://raw.githubusercontent.com/jlucaspains/sharp-cred-manager/refs/heads/main/docs/demo2.png?raw=true"
    alt: "Sharp Cred Manager - secrets dashboard"
    caption: "Sharp Cred Manager - secrets dashboard"
---

I see it happening too often. A credential expires, goes unnoticed, and causes downtime. Granted, you should have DevOps processes in place to handle credential rotation, but if you don't, the risk is significant. That's why I created Sharp Cert Manager a few years ago as a simple tool to help monitor and notify about certificate expiration. It might not fix the problem for you, but it will nag you often enough that you will probably take action.

Over the last few years, I worked on a project that required all secrets to be rotated on a specific cadence to align with NIST recommendations. In that project, we had introduced processes to monitor and rotate the secrets in addition to the certificates, but I realized that monitoring secrets would be a great addition to Sharp Cert Manager — but at that point, it wasn't really about certs anymore, was it?

Today, I released a beta version of Sharp Cred Manager. Note that the project, repository, and Docker image were all renamed to reflect the broader scope. The notable features in v2-beta are:

1. Added Azure Key Vault secret monitoring alongside existing certificate monitoring capabilities.
2. Monitored secrets are displayed on the dashboard and included in webhook notifications.
3. `[BREAKING]` The environment variable `AZUREKEYVAULT_N` was renamed to `AZUREKEYVAULTCERT_N`.

The general look and feel is preserved, with minor adjustments to display secrets in the dashboard and webhook notifications. Take a peek below:

Dashboard:
![Sharp Cred Manager Certificates Dashboard](https://github.com/jlucaspains/sharp-cred-manager/blob/main/docs/demo.png?raw=true)

![Sharp Cred Manager Secrets Dashboard](https://raw.githubusercontent.com/jlucaspains/sharp-cred-manager/refs/heads/main/docs/demo2.png?raw=true)

Slack Notification:
![Sharp Cred Manager Slack Notification](https://github.com/jlucaspains/sharp-cred-manager/blob/main/docs/SlackDemo.png?raw=true)

Teams Notification:
![Sharp Cred Manager Teams Notification](https://github.com/jlucaspains/sharp-cred-manager/blob/main/docs/TeamsDemo.png?raw=true)

You can review the full documentation, including a Getting Started guide and Migration Guide, at [Sharp Cred Manager - GitHub](https://github.com/jlucaspains/sharp-cred-manager).

If you want to try out the app, the easiest way is to spin it in a local container:

```bash
# Replace the tenant id, client id, and secret environment variables with Azure credentials with Key Vault Reader role. 
# You can also run the command in podman
docker run -it -p 8000:8000 \
    --env ENV=DEV \
    --env SITE_1=https://expired.badssl.com/ \
    --env AZUREKEYVAULTCERT_1=https://mykeyvault.vault.azure.net/certificates/my-cert \
    --env AZUREKEYVAULTSECRET_1=https://mykeyvault.vault.azure.net/secrets/my-secret \
    --env AZURE_TENANT_ID=00000000-0000-0000-0000-000000000000 \
    --env AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000 \
    --env AZURE_CLIENT_SECRET=<secret> \
    jlucaspains/sharp-cred-manager
```

I hope you give Sharp Cred Manager a try.

Cheers,\
Lucas