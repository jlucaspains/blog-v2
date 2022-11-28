---
layout: post
title: "How to copy certificates between Azure Key Vaults"
date: 2022-11-23
categories:
  - azure
description: >-
  Azure key vaults can store many certificates but moving them around can be hard. Using Powershell, it is not so hard anymore.
cover:
    image: "/images/posts/security.jpg"
    alt: "Photo by Pixabay"
    caption: "Photo by [Pixabay](https://www.pexels.com/photo/security-logo-60504/)"
---

I recently had to copy a few certificates between Azure key vaults. These certificates were issued in one key vault but given access restrictions, they were consumed from another key vault.

> **Note 1**: copying certificates between key vaults is generally a bad idea as the copied certificate will not follow any automatic renewal setup for the original.

The powershell script below was imported mostly from this [StackOverflow answer](https://stackoverflow.com/a/64655282). The primary change done was to use the X509Certificate2 class constructor instead of the ``Import`` method which is [not recommended](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.x509certificates.x509certificate2.import?view=net-7.0#system-security-cryptography-x509certificates-x509certificate2-import(system-byte()-system-security-securestring-system-security-cryptography-x509certificates-x509keystorageflags)).

> **Note 2**: you will need to login to Azure using ``Connect-AzAccount`` before running the script.

{{< gist jlucaspains 3956f60f0d569c32d43f8a0a5628ab8b >}}

If you peruse the script, you will notice that we are using  ``Get-AzKeyVaultSecret`` to get the PFX cert encoded as Base64 string, convert it to a ``byte[]``, and finally import the certificate using ``Import-AzKeyVaultCertificate``.

You might be asking yourself *what happened to ``Get-AzKeyVaultCertificate``?*. While that command does exist, it returns a [``PSKeyVaultCertificate``](https://learn.microsoft.com/en-us/dotnet/api/microsoft.azure.commands.keyvault.models.pskeyvaultcertificate?view=az-ps-latest) object which is not compatible with the [``X509Certificate2Collection``](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.x509certificates.x509certificate2collection?view=net-7.0) type required by the ``Import-AzKeyVaultCertificate``. 


Cheers,

Lucas
