---
layout: post
title: "Setup MCP Registry for GitHub Copilot"
date: 2025-12-18
categories:
  - DevOps
  - AI
description: >-
    TBD
cover:
    image: "/images/posts/TBD.png"
    alt: "TBD"
    caption: "TBD"
---

An MCP (Model Context Protocol) registry is a catalog that stores and manages MCP servers. In the context of GitHub Copilot, it can help centralize discovery and enforcement of available and allowable MCP servers. This is particularly useful for organizations that want to control which MCP servers their developers can access when using GitHub Copilot. In this post, we explore how to set up an MCP registry for GitHub Copilot.

## What does a registry look like?
An MCP registry is essentially a collection of MCP server entries, each containing metadata about the server, such as its URL or configuration for location execution. The current specification for MCP registries can be found at https://registry.modelcontextprotocol.io/docs. There are several endpoints required in the MCP registry specification. For instance, to list available MCP servers one can use `{baseUrl}/v0.1/servers`. The example below demonstrates the result if the registry had a single MCP Server for Microsoft Learn.

> NOTE: Currently, VS Code will only work with version `2025-09-29` of the MCP server schema.
> NOTE2: Registries must support CORS and be public to be consumable by GitHub Copilot in VS Code.

```json
{
  "servers": [
    {
      "server": {
        "$schema": "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
        "name": "microsoft-learn",
        "title": "Microsoft Learn",
        "description": "AI assistant with real-time access to official Microsoft documentation.",
        "version": "v1",
        "remotes": [
          {
            "type": "sse",
            "url": "https://learn.microsoft.com/api/mcp"
          }
        ]
      },
      "_meta": {
        "io.modelcontextprotocol.registry/official": {
          "status": "active",
          "createdAt": "2025-12-18T18:04:58.0940156+00:00",
          "updatedAt": "2025-12-18T18:38:58.4130338+00:00",
          "isLatest": true
        },
        "x-ms-id": "4a603e42-c7a4-4c7b-b93b-038cb23a5ef2"
      }
    }
  ],
  "metadata": {
    "count": 1
  }
}
```

## Setup MCP Registry
There are multiple ways to set up an MCP registry for GitHub Copilot, including using API Center, a public MCP registry, or a custom MCP registry. Each have their own benefits and challenges as outlined below.

| Approach                         | Pros                                                | Cons                                         |
|----------------------------------|-----------------------------------------------------|----------------------------------------------|
| API Center                       | Centralized management, integration with other APIs | Requires setup and maintenance of API Center |
| registry.modelcontextprotocol.io | Easy to use, no setup required                      | No control over available MCP servers        |
| Custom MCP registry              | Full control over MCP servers                       | Requires development and maintenance effort  |

By default, GitHub Copilot uses the public MCP registry hosted at github.com/mcp. This registry provides a list of publicly available MCP servers that developers can use without any additional configuration.

### Using API Center
Azure API Center is a centralized platform for managing APIs and API-related resources. It can function as an MCP registry, providing enterprise control over which MCP servers are available to developers. This approach is ideal for organizations that want to curate and govern their MCP server ecosystem while leveraging Azure's management capabilities. To use API Center as an MCP registry for GitHub Copilot, follow these steps:

1. Create an API Center Resource
2. Register MCP Servers
   1. See this video for a walkthrough: https://www.youtube.com/watch?v=example
3. Configure CORS Settings and allow anonymous access
4. Get Your Registry URL
   1. Your URL should look like this `https://my-api-center.data.canadacentral.azure-apicenter.ms/workspaces/default/`
   2. The added `/worspaces/default/` is required
5. Configure GitHub Enterprise/Organization

### Using registry.modelcontextprotocol.io
Similarly to the GitHub MCP registry, you can use the public MCP registry hosted at https://registry.modelcontextprotocol.io. This registry provides a list of publicly available MCP servers that developers can use without any additional configuration. To use this registry, simply configure the MCP registry URL in your GitHub enterprise/organization settings to point to https://registry.modelcontextprotocol.io.

### Using a custom MCP registry
You can either develop your own MCP registry implementation or use an existing open-source solution. Note that at minimum the following endpoints are needed for version 0.1 of the MCP registry API: 

| Endpoint                                      | Description                                                                                          |
|-----------------------------------------------|------------------------------------------------------------------------------------------------------|
| /v0.1/servers                                 | Returns a list of all registered MCP servers                                                         |
| /v0.1/servers/{serverName}/versions           | Returns all available versions for a specific MCP server, ordered by publication date (newest first) |
| /v0.1/servers/{serverName}/versions/{version} | Returns detailed information about a specific version of an MCP server.                              |

> Review the [MCP Server Registry API Open API spec](https://elements-demo.stoplight.io/?spec=https://raw.githubusercontent.com/modelcontextprotocol/registry/refs/heads/main/docs/reference/api/openapi.yaml) for complete list of endpoints including optional.

Note that implementing your own registry from scratch is not trivial. If you need to go totally custom, consider starting from an existing open-source implementation like [modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry).

## Configure GitHub Enterprise/Organization
To make your registry available to your organization:

1. Navigate to your GitHub Enterprise or Organization settings
2. Go to **Copilot** > **Settings** > **Model Context Protocol**
3. In the **Registry URL** field, enter the URL of the chosen registry:
   ```
   https://my-api-center.data.canadacentral.azure-apicenter.ms/workspaces/default/
   ```
4. Enable **Require MCP servers from registry only** if you want to restrict developers to only approved servers
5. Click **Save**

## Verify the Setup
To verify that your registry is working correctly:

1. Open VS Code with GitHub Copilot installed
2. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "MCP" and select **GitHub Copilot: Configure MCP Servers**
4. You should see the MCP servers registered in your registry
5. Enable the desired servers and test by asking Copilot to use them