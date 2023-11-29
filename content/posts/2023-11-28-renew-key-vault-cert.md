---
layout: post
title: "Renewing an Azure Key Vault certificate with same key"
date: 2023-11-28
categories:
  - DevOps
description: >-
    Renewing an Azure Key Vault certificate with the same key is an interesting process, let's review it in this post.
cover:
    image: "/images/posts/encrypted.jpg"
    alt: "Encrypted"
    caption: "Photo by [Markus Spiske](https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/matrix-movie-still-iar-afB0QQw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
---

Renewing certificates in Azure Key Vault, especially when using providers like Go Daddy that offer only `.pem` or `.crt` files, might seem complex. However, with the right steps, it becomes straightforward. Below, I'll guide you through the process assuming you have a new certificate and CA certificate as `.crt` files and access to the current certificate as a `.pfx` in Azure Key Vault.

Before you begin, ensure you have [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/) and [OpenSSL](https://www.openssl.org/) installed.

1. Prepare Your Files:\
Name your new certificate `certificate.crt` and the CA certificate `cert-cas.crt`. If you're keeping different names, adjust the commands accordingly.

2. Extract the Key:\
Fetch the key from Azure Key Vault or extract it from the .pfx file.

```bash
# Option 1. Download the key from Azure Key Vault
az keyvault secret download --vault-name key-vault-name --name cert-name --file key_from_azure.pem --encoding base64
openssl rsa -in key_from_azure.pem -out cert.key

# Option 2. Extract key from a .pfx file
openssl pkcs12 -in old-cert.pfx -nocerts -out cert.key -password thepassword
```

3. Combine Certificates:\
Combine the CA certificate and new certificate to create a complete certificate chain.

```bash
# This step is required for anything that requires the whole certificate chain like Azure App Gateway.
cat cert-cas.crt certificate.crt > combined-cert.crt
```

4. Create New `.pfx` File:\
Generate a new `.pfx` file using the original key and the combined certificate.

```bash
openssl pkcs12 -export -out cert.pfx -inkey cert.key -in combined-cert.crt -password thepassword
```

5. Upload to Azure Key Vault:\
Upload the new `.pfx` file as a new version of the certificate in Azure Key Vault.

```bash
az keyvault certificate import --vault-name vaultname --name cert_name --file cert.pfx --password thepassword
```

6. Disable Previous Version:\
Manually disable the previous version to ensure the new one is active.

These steps streamline the renewal process, ensuring your certificates are updated while retaining the original keys, crucial for maintaining secure connections. Adjustments may be needed based on specific provider processes, but these instructions serve as a solid foundation for Azure Key Vault certificate renewal.

Cheers,\
Lucas