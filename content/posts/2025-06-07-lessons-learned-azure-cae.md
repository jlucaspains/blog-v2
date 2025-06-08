---
layout: post
title: "10 Lessons Learned Using Azure Container Apps"
date: 2025-06-07
categories:
  - azure
  - containers
description: >-
    Reflections and practical insights from two years of working with Azure Container Apps.
cover:
    image: "/images/posts/AzureContainerApps.png"
    alt: "Azure Container Apps"
    caption: "Azure Container Apps"
---

Over the past two years, I have worked extensively with Azure Container Apps (ACA) and have gained valuable insights into its capabilities and limitations. In this post, I share ten key lessons learned from real-world experience.

## 1. You get much of Kubernetes without the added complexity

Azure Container Apps provides a streamlined way to run containerized applications without the overhead of managing Kubernetes infrastructure. It abstracts away much of the operational complexity, allowing developers to focus on building and deploying applications. Despite this abstraction, ACA retains powerful Kubernetes features such as ingress, scaling, auto-healing, service discovery, and networking.

The Consumption plan is very cost-effective. You can run container apps with as little as 0.25 vCPU and 0.5 GiB RAM, making it suitable for workloads of any size.

However, you do not have direct control over the underlying platform. You are limited to the features provided by ACA. If you require deeper control, Azure Kubernetes Service (AKS) may be a better fit. For example, I encountered a situation where the nodes hosting my container apps became unreachable. ACA's self-healing automatically recreated the apps on new nodes, but since node management is abstracted away, troubleshooting was not possible. In AKS, you would have access to the nodes for investigation and resolution. I will elaborate on this later in the post.

## 2. There are two types of Container App Environments (CAE)

When creating a Container App Environment (CAE), you can choose between two types: Consumption Only and Workload Profiles. Workload Profiles is generally recommended, as it supports both consumption and dedicated plans, while Consumption Only is limited to the consumption plan. Additionally, certain features such as User-Defined Routes (UDR) and GPU workload support are only available with Workload Profiles. For new deployments, it is recommended to use Workload Profiles.

```bash
# Create a CAE. The `--enable-workload-profiles` can be used to determine the CAE type.
az containerapp env create \
    --name myEnvironment \
    --resource-group myResourceGroup \
    --location eastus
    --enable-workload-profiles {false, true}
```

## 3. Container app jobs are a great way to run scheduled tasks.

If you need to run scheduled tasks in a container, container app jobs are an excellent solution. You can schedule a job using a CRON expression, and it will run in a container app. I've been running [sharp-cert-manager](https://github.com/jlucaspains/sharp-cert-manager) jobs in several environments and they work reliably. Since you only pay for the resources used while the job is running, this approach is very cost-effective for short-lived jobs.

```bash
az containerapp job create `
    --name sharp-cert-manager `
    --resource-group <resource-group> `
    --image jlucaspains/sharp-cert-manager `
    --trigger-type "Schedule" `
    --replica-timeout 1800 `
    --cpu "0.25" --memory "0.5Gi" `
    --cron-expression "0 8 * * 1" `
    --replica-retry-limit 1 `
    --parallelism 1 `
    --replica-completion-count 1 `
    --env-vars ENV=DEV `
SITE_1=https://blog.lpains.net/ `
CERT_WARNING_VALIDITY_DAYS=90 `
HEADLESS=true `
WEBHOOK_TYPE=teams `
WEBHOOK_URL=<webhook-url> `
MESSAGE_MENTIONS=<user@domain.com>
CHECK_CERT_JOB_NOTIFICATION_LEVEL=Info
```

## 4. Consumption plan apps may restart unexpectedly

As mentioned earlier, ACA apps are generally stable in production. However, I have experienced cases where the underlying node became unreachable or have another untolerated taint, causing apps to be recreated on new nodes. After moving the affected workloads to a dedicated plan, I have not seen this issue recur. This appears to be a platform-level problem. Microsoft support has yet to provide a definitive answer. For production workloads, I recommend using dedicated plans for improved reliability, but be aware that dedicated plans are significantly more expensive than consumption plans. At the time of writing, a dedicated plan with 3 instances at the smallest size (4 vCPU, 16 GiB RAM) will cost close to $700 per month. See [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) for more details.

See below for an example of a node that became unreachable, which caused the container app to be recreated on a new node. In a particular environment, I saw this happen multiple times a day leading to errors in the app.

![Node Unreachable Example](https://learn-attachment.microsoft.com/api/attachments/ddc4ea6c-9682-4d3f-aa8c-fc49703bfea6?platform=QnA)

## 5. You can't directly create a probe via CLI commands

When creating a container app using CLI commands, you cannot imperatively define startup, liveness, or readiness probes. This is a current limitation of the CLI. However, you can define probes in a YAML file and use the `--yaml` option with the create or update commands.

Example YAML file for creating or updating a container app with a Readiness probe:
```yaml
type: Microsoft.App/containerApps 
location: eastus 
name: helloworld
resourceGroup: myresourcegroup 
properties: 
  managedEnvironmentId: /subscriptions/mysubscriptionid/resourceGroups/myresourcegroup/providers/Microsoft.App/managedEnvironments/myenvironment 
  workloadProfileName: "Consumption" 
  configuration: 
    activeRevisionsMode: Single 
    ingress: 
      external: true 
      allowInsecure: false 
      targetPort: 80 
      traffic: 
        - latestRevision: true 
          weight: 100 
      transport: Auto 
  template: 
    containers: 
      - image: mcr.microsoft.com/azuredocs/containerapps-helloworld:latest 
        name: helloworld
        resources: 
          cpu: 0.25 
          memory: 0.5Gi
        probes:
        - type: Readiness
          initialDelaySeconds: 5
          periodSeconds: 10
          successThreshold: 1
          failureThreshold: 10
          httpGet:
            port: 80
            path: /ready
            scheme: HTTP
```

```bash
az containerapp create -n name -g rg \
 --yaml "path/to/yaml/file.yml"
```

## 6. You can't directly use a system identity to pull from a private ACR

When you first create an app, you can also create the system identity for it. In this scenario, it won't have the necessary `acrpull` permission needed to pull the image. Microsoft recommends first using a public image, granting the permission, then creating a revision. Alternatively, you can use a user-assigned identity instead, which is the recommended approach.

Read more on [Azure Container Apps image pull with managed identity](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity-image-pull?tabs=bash&pivots=portal)

## 7. Run Azure Functions in Container App Environments

[In May 2024](https://learn.microsoft.com/en-us/azure/container-apps/whats-new#may-2024), Microsoft made Azure Functions on Azure Container Apps generally available. This means you can now run Azure Functions in ACA instead of an App Service Plan. While this approach is not fully native, as both a function app and a container app are created, you no longer need an App Service Plan to run functions. This is a good way to run functions alongside other containerized applications in a single environment. You can also use the consumption plan for functions, which can reduce costs. Note that your function must be containerized, but the code remains the same.

```bash
# Minimum CPU is 0.5 and minimum memory is 1.0Gi
# Ensure the user-assigned identity has the necessary permissions to ACR and Storage Account.
# When an environment is provided, the function app will be created in the container app environment instead of an App Service Plan.
az functionapp create \
    --name "$appname" \
    --resource-group "$rg" \
    --storage-account "$storageaccountname" \
    --assign-identity "$fulluaiid" \
    --environment $environmentname \
    --min-replicas 1 \
    --max-replicas 3 \
    --functions-version "4" \
    --runtime "dotnet-isolated" \
    --image "$fulltaggedimage" \
    --workload-profile-name "$profilename" \
    --cpu 0.5 \
    --memory 1.0
```

Recently, you can also create a [native function app in ACA](https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-native-azure-functions-support-in-azure-container-apps/4414039). In this case, only the container app resource is created. This feature is still in preview and not recommended for production workloads yet.

```bash
# kind must be functionapp
# If reading from a Service Bus queue, configure it via environment variables for scale-to-zero to work.
# Use a user-assigned identity for Service Bus access to avoid storing secrets in environment variables.
# Ensure the user-assigned identity has the necessary permissions to Service Bus and ACR.
az containerapp create \
    --name "$appname" \
    --container-name "$appname" \
    --resource-group "$rg" \
    --cpu 0.5 \
    --memory 1.0Gi \
    --environment "$caename" \
    --kind functionapp \
    --image "$fulltaggedimage" \
    --workload-profile-name Dedicated-D4 \
    --ingress external \
    --target-port 80 \
    --env-vars  ASPNETCORE_ENVIRONMENT="Production" \
                AZURE_FUNCTIONS_ENVIRONMENT="Production" \
                FUNCTIONS_WORKER_RUNTIME="dotnet-isolated" \
                FUNCTIONS_EXTENSION_VERSION="~4" \
                EmailQueueName="$sbqueuename" \
                ServiceBusConnectionActionSubmission__fullyQualifiedNamespace="$sbnamespace.servicebus.windows.net" \
                ServiceBusConnectionActionSubmission__credential="managedidentity" \
                ServiceBusConnectionActionSubmission__clientId="$uidclientid" \
    --min-replicas 1 \
    --max-replicas 3 \
    --registry-server "$targetacrname.azurecr.io" \
    --registry-identity $fulluaiid \
    --user-assigned "$fulluaiid"
```

See the created examples. When using the non-native function app, you get both a function app and a container app resources (helloworldlpains). When using the native function app, you only get a container app resource (helloworldlpains2).

![Function examples](/images/posts/helloworldlpainsfunction.png)

## 8. If logs are not getting saved

I also encountered an issue where both container and environment logs were not being saved to Log Analytics Workspace (LAW), even though the container environment was configured to send logs to the correct LAW resource. It turned out that the `ContainerAppSystemLogs_CL` and `ContainerAppConsoleLogs_CL` log tables no longer matched the container environment's log schema. Creating a new LAW resource and reconfiguring the container app to send logs there resolved the issue.

## 9. Be careful with liveness probes

This is also true for Kubernetes, but worth highlighting. If you configure a liveness probe and it fails over its configured threshold, the container app will be restarted. This can cause unexpected downtime if your app cannot recover quickly. In most cases, it's better not to explicitly set up a liveness probe. ACA will automatically probe the container port using a TCP connection for liveness. If you do need a liveness probe, ensure it is configured correctly and that your app can recover quickly from failures.

See the Kubernetes documentation for more details on [configuring probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

## 10. Avoid using ingress for internal app communication

If you have multiple container apps that need to communicate with each other, avoid using ingress for internal communication. Instead, use the internal service discovery provided by CAE. For example, if you have a container called `orderapi` that exposes port 80, you can make HTTP calls to it using `http://orderapi/`. This keeps traffic within the ACA environment, reducing latency and improving performance. Ingress should generally be reserved for external traffic.

Do you have any other lessons learned from using Azure Container Apps? I would love to hear about your experiences and insights. Feel free to share them in the comments below.

Cheers,\
Lucas