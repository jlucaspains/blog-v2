---
layout: post
title: "8 lessons learned on Azure Container Apps"
date: 2025-06-03
categories:
  - azure
  - containers
description: >-
    TBD.
cover:
    image: ""
    alt: "TBD"
    caption: "TBD"
---

For the last 2 years, I've been working heavily with Azure Container Apps (CAE) and have learned a lot about it. In this post, I want to share some of the lessons I've learned along the way.

## 1. You get much of kubernetes without the additional complexity
Azure Container Apps provides a simplified way to run containerized applications without the need to manage the underlying Kubernetes infrastructure. It abstracts away much of the complexity associated with Kubernetes, allowing developers to focus on building and deploying their applications. However, it still retains some of the powerful features of Kubernetes, such as ingress, scaling, service discovery, and networking.

The Consumption plan is very cheap. You can run container apps with as little as 0.25 CPU and 0.5 GB of memory. This makes it a cost-effective solution for running containerized applications, especially for small to medium-sized workloads.

On the flip side, you don't get control over the platform at all. You get what container apps provide only. If you need more control, you may want to use Azure Kubernetes Service (AKS) instead. Recently, I ran into a problem where the nodes where my container apps were running became unreachable. The self-healing kicked in and the apps were recreated on new nodes. That's ok, but since you have no control over the nodes, you can't even troubleshoot the problem. In AKS, you would be able to troubleshoot the node and possibly resolve the problem. I will provide more details on this later in the post.

## 1. There are 2 versions of CAE
When creating a Container App Environment (CAE), you have the option to choose between two versions: Consumption Only and Workload Profiles. Workload Profiles is generally recommended as it supports both consumption and dedicated plans, while Consumption Only is limited to Consumption plans. Some features are also only available in Workload Profiles, such as the ability to use User-Defined Routes (UDR) and support for GPU workloads. If you are creating a new CAE, use Workload Profiles.

TODO: az containerapp create 1
TODO: az containerapp create 2

## 5. Container app jobs are a great way to run scheduled tasks.
If you need a to run jobs in a container, container app jobs are a great way to do it. You can schedule a job to run using a CRON expression, and it will run in a container app. I've been running [sharp-cert-manager](https://github.com/jlucaspains/sharp-cert-manager) jobs in several environments and they work great. Additionally, because you only pay for the resources used while the job is running, it's a cost-effective solution for running scheduled tasks. I will cost you pennies to run short lived jobs in container apps.

TODO: az containerapp create

## 2. Consumption plans apps restart often. Use dedicated plans for production workloads.
Like I mentioned earlier, I've been using CAE for over 2 years now and in general the apps are rock solid in PROD environment. However, we ran into issues where the node itself became unreachable and the apps would be recreated on new nodes. We shifted our workload to dedicated plan and we haven't seen the problem since then. This is likely a problem in the platform itself. Questions I raised in MS Learn had not answer and we are still waiting on MS Support for answers. As of now, I would recommend using dedicated plans for production workloads to avoid such issues.

TODO: picture of node unreachable

## 4. You can't directly create a probe via CLI commands.
When creating a container app via CLI commands, you cannot imperatively create a liveness or readiness probe. This is a limitation of the CLI commands. However, you can create a probe via YAML file and then use the create or update commands with `--yaml` option.

```bash
az containerapp create -n name -g rg \
 --yaml "path/to/yaml/file.yml"
```

## 5. You can't directly use a system identity to create a container with private ACR.
TODO: verify
The system identity may be created when you create a container app environment (CAE). Thus, it won't have the necessary `acrpull` permission needed to pull the image. MS Docs recommend you first use a public image, grant the permission, than create a revision. Alternatively, you can use a user defined identity instead. MS Docs recommends using user defined identity over system identity

Read more on [Azure Container Apps image pull with managed identity](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity-image-pull?tabs=bash&pivots=portal)

## 3. Run Azure Functions in CAE
[In May 2024](https://learn.microsoft.com/en-us/azure/container-apps/whats-new#may-2024) MS made Azure functions on Azure Container Apps (CAE) generally available. This means you can now run Azure Functions in CAE instead of an App Service. While this approach is not native and a bit awkward, given that both a function app and a container app are created, you no longer need an AppService to run functions. This is a good way to run functions together with other containerized applications in a single environment. Also, you can run functions in a consumption plan instead of paying the App Service plan. Do note you need your function to be containerized, but the code remains the same.

TODO: docker image for function app
TODO: az containerapp create
```bash
# Minimum CPU is 0.5 and minimum memory is 1.0Gi
# Ensure to grant the user assigned identity the necessary permissions to service bus, ACR, and storage account.
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

Fast forward to today, and you can create a [native function app in CAE](https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-native-azure-functions-support-in-azure-container-apps/4414039). This means a function app resource is no longer created, only the container app. This feature is still in preview though so it is not recommended for production workloads yet.

```bash
# Minimum CPU is 0.5 and minimum memory is 1.0Gi
# Kind must be functionapp for the scaling to 0 to work
# If reading from a service bus queue, you must configure it via environment variables for the scaling to 0 to work. I recommend using a user assigned identity to access the service bus queue so youd don't need to put a secret in the environment variables.`
# Ensure to grant the user assigned identity the necessary permissions to service bus and ACR.
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

1. Using function app CLI or container app CLI.
2. Scale to 0 capability

## 6. If logs are not getting saved
Another interesting issue I ran into. Both container and container environment logs were not getting saved to Log Analytics Workspace (LAW) even though I had configured the container environment to send logs to the right LAW resource. It seems that at some point, the `ContainerAppSystemLogs_CL` and `ContainerAppConsoleLogs_CL ` log tables no longer matched the container environment's log schema. This caused the logs to not be saved correctly. Creating a new LAW resource and configuring the container app to send logs to the new LAW resource resolved the issue.

## 7. Be careful with liveness probe as it may restart your app on failures.
This is also true for Kubernetes, but it's worth mentioning. If you have a liveness probe configured and it fails, the container app will be restarted. This can lead to unexpected downtime if the app is not able to recover quickly. For most scenarios, it is likely better to not explicitly setup a liveness probe. CAE will automatically probe the container port using TCP connection for liveness. If you need to use a liveness probe, make sure that it is configured correctly and that the app can recover quickly from failures.

See kubernetes documentation for more details on [configuring probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

## 8. Avoid using ingress for internal app communication.

Cheers,\
Lucas