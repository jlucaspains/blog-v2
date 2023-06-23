---
layout: post
title: "Azure App Gateway Deployment with Bicep"
date: 2023-06-23
categories:
  - azure
description: >- 
  Deploying an Azure App Gateway over an App Service can be a daunting task. In this post, let's do it with Bicep for a non-trival .NET application.
cover:
    image: "/images/posts/app-gateway-cover.jpg"
    alt: "Cyber Security"
    caption: "Photo by [FLY:D](https://unsplash.com/es/@flyd2069?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/mT7lXZPjk7U?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

Deploying an Azure App Gateway can be a daunting task, especially when creating a reusable template for it due to the verbosity of the template. In this post, I will describe how to create and execute a Bicep template for an externally visible web app with an Application Gateway. By the end of this post, the following requirements will be met:

1. Web app hosted in App Service with Azure-provided certificate for TLS
2. Web Application Firewall (WAF) with OWASP 3.2 and an example exception
3. TLS cert for App Gateway stored in Key Vault

## TLDR;
See the Bicep templates at [BlogSamples](<https://github.com/jlucaspains/BlogSamples/tree/master/AzureAppGateway>).

## Components
For the discussed requirements, the following components are necessary in Azure. As mentioned, this is not a small or simple deployment.

- Public IP address
- App Gateway
- WAF Policy
- App Gateway Identity for Key Vault with SSL Certificate
- Web App
- Key Vault
- VNet

All components are deployed within a single Resource Group in Azure via Bicep templates.

## Bicep modules
Bicep modules are just `.bicep` files that can be invoked from other modules. I am using them here for organization and ordering of operations.

### Key Vault
> NOTE: the vault will be created but the TLS certificates need to be manually provisioned.

For a full release to work, we need to deploy the key vault and contain the appropriate certificate. Since there is no easy way to issue the required certificate during the Bicep deploy, we need to choose between:

1. Deploy the key vault manually and create the cert before applying the Bicep templates
2. Deploy the Bicep templates, wait for it to fail due to the missing certificate, add the certificate and redeploy.

Either option is less than ideal, so I will leave it up to you to decide which way to go.

Key Vault Module:
{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 key-vault.bicep >}}

### Web App
This is the web app to be protected by the App Gateway. While not necessary, it is a good practice to enable and enforce TLS in the web app. This ensures that the connection between the App Gateway and the web app is also encrypted. The default *.azurewebsites.net certificate works for what we need here. If you need to do something like multi-tenancy via sub-domain names, you will need your own wildcard certificate and install it on the web app along with a custom domain name.

Another good practice is to prevent public access to the web app so that App Gateway is not circumvented. This can be achieved by setting IP restrictions or creating an Azure Private Link that ensures the connection follows internal VNets only. Private Links are more secure, but it takes a bit of extra effort to get it working.

Web App Module:
{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 web-app.bicep >}}

### App Gateway
> **IMPORTANT**: App Gateway TLS does not work with certificates issued by Let's Encrypt or Google Trust Services when they are imported from a key vault. If you use these providers, manually import the certificate in the app gateway listener instead.

The App Gateway module will create a few resources: VNet, Public IP Address, User Assigned Identity, WAF Policy, and the App Gateway itself.

App Gateway does not provide System Assigned identities yet. Thus, we will need to create a user assigned identity and assign it to the app Gateway. This identity will allow for key vault access.

{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 app-gateway-identity.bicep >}}

A WAF policy needs to be created for the app gateway to reference. This is where we set up the managed rules to be followed (e.g.: OWASP 3.2), any custom rules (e.g.: block access if missing a header), and finally exclusions to the managed ruleset selected (e.g.: do not inspect a base 64 encoded header).

{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 app-gateway-policy.bicep >}}

Finally, create the App Gateway itself.

{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 app-gateway.bicep >}}

### Main module
The main module is the entry point used to deploy all the modules. I also used it to define module ordering and dependency so that components are deployed correctly.

{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 main.bicep >}}

## Deploying
You will need a `parameters.json` file in the same folder where the Bicep templates are:

{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 parameters.json >}}

Adjust the settings according to your environment. Then, run the following command in a bash terminal:

{{< gist jlucaspains a39b5cc69185cf87d88087a49155fc02 deploy.sh >}}

Now that the whole infrastructure is available, go ahead and deploy the code for it and create a A record in your DNS provider pointing to the public IP address of the app gateway. If you need an example app, I have an example at [BlogSamples](https://github.com/jlucaspains/BlogSamples/tree/master/AzureAppGateway/API).

## Closing
Putting an App Gateway over a Web App requires a lot of work, but the content of this post should work for most single domain apps. If you need to use wildcard certificates or multi-domain apps, the configuration will become even more challenging. In any case, that's a post for another day.

Cheers,
Lucas