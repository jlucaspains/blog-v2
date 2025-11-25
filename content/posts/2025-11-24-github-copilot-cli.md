---
layout: post
title: "GitHub Copilot CLI: Boost Developer Productivity in the Terminal"
date: 2025-11-24
categories:
  - DevOps
description: >-
    Discover how GitHub Copilot CLI brings AI-powered assistance directly to your terminal. Learn about custom agents, MCP servers, CI/CD integration, and practical tips to boost your development productivity.
cover:
    image: "/images/posts/CopilotCLI.gif"
    alt: "GitHub Copilot CLI in action showing terminal-based AI assistance"
    caption: "GitHub Copilot CLI: Your AI pair programmer in the terminal"
---

I've been using [GitHub Copilot CLI](https://github.com/features/copilot/cli) for a few weeks now, and it has significantly enhanced my productivity beyond what Copilot in IDEs already provides. In this post, I'll share my experience and practical tips to help you maximize this powerful terminal-based AI assistant.

> **NOTE:** GitHub Copilot CLI is in public preview. Features may change before general availability.

## What is GitHub Copilot CLI?

GitHub Copilot CLI brings AI-powered assistance directly to your terminal, similar to the IDE experience but optimized for command-line workflows. It stays unobtrusive until needed and excels for developers who prefer terminal-based work. Beyond code completions, Copilot CLI enables powerful automation capabilities—you can run prompts in CI/CD pipelines, background jobs, or any automated workflow.

> **Important:** AI output is not deterministic. Always review AI-generated content before implementation.

## Prerequisites

Before getting started, ensure you have:
- **Node.js v22+** and **npm v10+**
- **GitHub Copilot Pro** or Enterprise license
- **Copilot CLI enabled** on your GitHub account or organization
- **At least one AI model** enabled (e.g., Claude Sonnet 4.5, GPT-4o, or Gemini 2.5 Pro)

## Getting Started

Install GitHub Copilot CLI globally using npm:

```bash
npm install -g @github/copilot
```

Launch Copilot CLI in your project directory:

```bash
# ensure to start on the project folder
cd /project/folder
# --banner is optional, but the animation is worth it
copilot --banner
# trust the folder if prompted
```

Authenticate with your GitHub account:

```bash
/login
# Choose whether you are using GitHub.com or GitHub Enterprise, 
# and follow the instructions to authenticate.
```

You're now ready to use Copilot CLI!

## Basic Usage

Copilot CLI offers multiple interaction methods:

1. **Slash commands**: Type `/` to see available commands.
2. **Inline prompts**: Type your prompt directly in the terminal.
3. **Files and folders**: Reference files or folders in your prompts for context.

Try these examples to get started:

```bash
# see the available models
/model show

# use model Claude Sonnet 4.5
/model claude-sonnet-4.5

# Simple prompt
Generate a readme.md for this project

# Using a file for context
Fix the errors in @unitests/test_app.py
```

## Using Custom Agents

Custom agents are pre-configured AI personas designed for specific tasks. Create agents by defining their behavior in markdown files within the `.github/agents` folder. Here's an example agent for blog content review:

```markdown
---
name: Reviewer
description: An agent designed to assist with blog content review and adjustments.
# version: 2025-11-22
---
You are an expert blog reviewer. You help review a blog post to ensure it fits the target audience, is clear, well-structured, concise, engaging, and follows best practices for SEO. You do not create new content, but can make adjustments to existing content so it fits the directives. 

When invoked:
- Understand the content and context
- Research relevant information and data to support the blog post
- Fact-check the blog post for accuracy
- Optimize the blog post for SEO with relevant keywords, meta descriptions, and headings
- Ensure the blog post is well-formatted with proper headings, bullet points, and images where appropriate
- Review and edit the blog post for clarity, grammar, and coherence
- Provide suggestions for improvement without adding new content
```

Agents configured for GitHub repositories work seamlessly in Copilot CLI as well.

**Best Practices for Custom Agents:**
- **Be specific:** Clearly define what the agent should and shouldn't do
- **Focus the scope:** The example above explicitly prevents new content creation, focusing on refinement only
- **Specialize when needed:** For mono-repos, create language-specific agents for better code reviews
- **Learn from examples:** Check the [Awesome Copilot](https://github.com/github/awesome-copilot) repository for inspiration

Use the `/agent` command to leverage custom agents in the CLI:

```bash
/agent
# select Reviewer

Review the blog post at @content/posts/2025-11-22-github-copilot-cli.md
```

## Using MCP Servers

Model Context Protocol (MCP) servers extend Copilot CLI's capabilities by enabling interaction with local and external services. While GitHub MCP is enabled by default, you can install additional MCP servers to streamline your workflow.

Manage MCP servers with the `/mcp` command:

```bash
/mcp [show|add|edit|delete|disable|enable]
```

For example, add the Playwright MCP server for browser automation:

```bash
/mcp add playwright
# Command: npx @playwright/mcp@latest
```

![image](/images/posts/CopilotCLI_mcp_add.png)

With the playwright MCP server added, you can take screenshots of web pages directly from the terminal:

```bash
Take a screenshot of https://example.com and save it as example.png
```

## Delegate Tasks to Remote Agents

The `/delegate` command enables you to offload tasks to specialized remote agents on GitHub.com, perfect for complex or time-consuming operations.

```bash
/delegate Your task description here
```

This creates an Agent Session where you can iterate and refine results. Copilot CLI provides a link to monitor progress, and upon completion, generates a draft pull request for review.

![image](/images/posts/CopilotCLI_delegate_session.jpg)

![image](/images/posts/CopilotCLI_delegate_pr.jpg)

## Using Copilot CLI in CI/CD and Background Jobs

Copilot CLI excels at tasks requiring reasoning without strict determinism, such as report analysis. The example below demonstrates using Copilot CLI in GitHub Actions to analyze certificate expiration reports and automatically create issues.

> **WARNING:** Grant Copilot CLI only the minimum privileges necessary. The more capabilities provided, the greater the risk of unintended actions. Always implement appropriate safeguards.

**Setup Steps:**
1. Create a fine-grained GitHub token with **Copilot Requests** access
2. Add the token as a `COPILOT_GITHUB_TOKEN` repository secret
3. Create a workflow file with the configuration below:

```yml
permissions: 
  issues: write

jobs:
  copilot-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: 1.24.0

      - name: Install GitHub Copilot CLI
        run: npm install -g @github/copilot

      - name: Generate certificate report
        run: |
          go install github.com/jlucaspains/sharp-cert-manager/cmd/sharp-cert-manager@latest
          sharp-cert-manager check --url https://expired.badssl.com/ > cert_report.txt
      - name: Run Copilot CLI command
        run: |
          copilot -p "Analyze the contents of @cert_report.txt it contains a list of certificate statuses. If any certificate have warnings or errors, detail the issue so I can create a GitHub issue manually. Do not provide reasoning or summary, just the body text of the issue." > cert_reviewed_summary.txt
        env:
          COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_GITHUB_TOKEN }}

      - name: Create Issue with Summary
        uses: peter-evans/create-issue-from-file@v3
        with:
          title: "Certificate Check Summary"
          content-filepath: cert_reviewed_summary.txt
```

**Advanced:** You can also use MCP servers in non-interactive mode, though the configuration requires additional parameters:

```bash
copilot --allow-all-tools --additional-mcp-config '{"mcpServers":{"playwright-mcp":{"type":"local","command":"npx","tools":["*"],"args":["-y","@playwright/mcp@latest"]}}}' --model claude-sonnet-4.5 --prompt "use playwright mcp to open link https://www.yahoo.com"
```

![image](/images/posts/CopilotCLI_ci-cd_issue.jpg)

## Alternatives

While GitHub Copilot CLI offers robust features, several alternatives worth considering include:

- **[Claude Code](https://www.anthropic.com/)** - Agentic workflow with strong privacy controls and repo-wide multi-file edits
- **[Codex CLI](https://developers.openai.com/codex/cli/)** - OpenAI's command-line tool for code generation and assistance
- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** - Google's Gemini model in a terminal interface

Each tool has unique strengths, choose based on your privacy requirements, budget, ecosystem, and workflow preferences.

## Additional Resources

- [Official GitHub Copilot CLI Documentation](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-command-line)
- [Custom Agents Guide](https://docs.github.com/en/copilot/customizing-copilot/creating-custom-agents-for-github-copilot)
- [Awesome Copilot Repository](https://github.com/github/awesome-copilot)

---

What's your experience with GitHub Copilot CLI? Have you discovered unique use cases or created custom agents? Share your thoughts in the comments below!

Cheers,\
Lucas
