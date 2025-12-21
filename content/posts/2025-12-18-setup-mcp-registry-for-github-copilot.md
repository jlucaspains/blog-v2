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
    image: "/images/posts/SpecKitPostCover.png"
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

By default, GitHub Copilot uses the public MCP registry hosted at registry.modelcontextprotocol.io. This registry provides a list of publicly available MCP servers that developers can use without any additional configuration.

### Using API Center
1. Create the API Center Repository
2. Register an API of type MCP for each MCP server you want to use.
3. Configure the MCP registry URL in GitHub enterprise/organization
https://hitachi-solutions-api-center.data.canadacentral.azure-apicenter.ms/workspaces/default/

### Using registry.modelcontextprotocol.io


### Using custom MCP registry