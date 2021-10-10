---
title: Setting up an Azure DevOps agent behind a proxy with self-signed certificate.
layout: post
date: 2020-04-07
comments: true
sharing: true
categories:
  - DevOps
description: >-
  Installing your own Azure DevOps is not too hard. Installing it when you are
  behind a proxy that replaces cert with a self-signed certificate is. This post
  will show you how to configure an agent with this extra complication.
---

In case you can't or don't want to use the Microsoft hosted agents (why?), setting up your own build servers is not too hard. Of course, I hope you don't have to deal with a proxy server. In the unlikely scenario that you have a proxy server, I honestly hope you don't have one with a self-signed certificate. Now, if you have to deal with all of this, I feel you. I put some notes together on how to get this setup done and have builds and releases running on your own agents flawlessly.

## Setting up DevOps agent behind a proxy
Microsoft has documentation on how to setup an agent behind a proxy. This works well so I will not repeat what they say. Basically, you will config the agent using below command:

```powershell
./config.cmd --proxyurl http://proxy.mycompany.com:8888 --proxyusername "myuser" --proxypassword "mypass"
```

This works well because the agent creates proxy configuration variables that the tasks can use. Most Microsoft maintained tasks (e.g. Nuget, npm, VS build/test, etc) will automatically use these variables.

## Fixing the self-signed certificate error

![Self Signed Certificate In Chain]({{site.baseurl}}/images/posts/SelfSignedCertificateInChain.png)

The next issue you might find is that your proxy uses self-signed certificates (why? just somebody tell me why!). If this happens, you will get the ``self signed certificate in certificate chain`` error. This happens because your proxy is doing a man in the middle attach on you. Without going into the reasons this would be ok, your proxy is replacing the original cert served to you with a cert of its own. To get rid of this error, you should trust your proxy's cert to let it do its thing.

First, export the cert root CA into a .cer or .pem file. Ensure you select Base 64 instead of DER encoding (I was lazy and reused an old gif from [Install Root CA cert in Android emulator]({{ site.baseurl }}{% link _posts/2018-7-7-install-root-ca-in-android.md %})):

![Export Certificate]({{site.baseurl}}/images/posts/ExportCertificate.gif)

Save the cert file to your build server and set a variable ``NODE_EXTRA_CA_CERTS`` to point to it.

```
setx NODE_EXTRA_CA_CERTS "c:\AzureDevOpsAgent\ProxyCACert.cer"
```

If you need to install several CA certificates, you can concatenate the content of the files together and change the file extension to ``.pem`` and changing your ``NODE_EXTRA_CA_CERTS`` export. Example of the ``.pem`` file:

```
BEGIN CERTIFICATE
base 64 encoded cert
END CERTIFICATE

BEGIN CERTIFICATE
base 64 encoded cert
END CERTIFICATE

BEGIN CERTIFICATE
base 64 encoded cert
END CERTIFICATE
```

Setting this environment variable fixed issues with nuget, npm, and git. There might be other task types that are not covered, but the basics should be.

Cheers,
Lucas