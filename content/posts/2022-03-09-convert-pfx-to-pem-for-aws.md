---
layout: post
title: "Convert PFX to PEM for AWS Certificate Manager"
date: 2022-03-09
categories:
  - util
  - DevOps
  - powershell
description: >-
  Learn how to convert a PFX certificate into a PEM encoded parts for AWS Certificate Manager import.
cover:
    image: "/images/posts/locks.jpg"
    alt: "Locks"
    caption: "Photo by [Parsoa Khorsand](https://unsplash.com/@parsoakhorsand?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/lock?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  "
---

When adding a certificate to AWS Certificate Manager, you need to have the certificate's PEM encoded body, private key, and certificate chain. Note that unless you have a self signed certificate, you will need the certificate chain. If your cert has a chain but you don't include it AWS will tell you an error occurred but it won't tell you what's wrong. I had to try and fail a few times before it worked.

Now, what if you have a pfx file which contains all the parts you need but it is not PEM encoded. How can you convert it? You can either use openssl, which is probably what most people would recommend, or you can use a Powershell module called [PSPKI](https://www.pkisolutions.com/tools/pspki/). 

Fair warning though, you are dealing with very sensitive information that could cause a disaster should you lose or expose. Use the solution below at your own risk.

```powershell
Install-Module PSPKI
Import-Module PSPKI
Convert-PfxToPem -InputFile C:\mycert.pfx -Outputfile C:\mycert.pem -IncludeChain
```

The exported pem file contents will look something like this:

```
-----BEGIN PRIVATE KEY-----
base 64 private key
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
base 64 certificate body
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
base 64 CA certificate
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
base 64 CA certificate
-----END CERTIFICATE-----
```

In the example above, note that the private key is decrypted. Again, that is dangerous land. Also, this example has 2 CA certificates. You may have none (self-signed), one, or more.

![image](/images/posts/aws-import-cert.png)

Now all that's left is to copy the appropriate parts of the pem file into AWS import certificate. Private key into private key field, first certificate into body field and the remaining certificates into the chain field. Ensure to copy the surrounding BEGIN and END portions as well.

Cheers!