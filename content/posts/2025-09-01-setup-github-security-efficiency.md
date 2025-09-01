---
layout: post
title: "Setting Up GitHub for Secure and Efficient Development"
date: 2025-09-01
categories:
  - DevOps
description: >-
    A practical guide to configuring GitHub security features, AI-powered assistance, and automated workflows to enhance your development experience and secure your codebase
cover:
    image: "/images/posts/github-security-configuration-cover.png"
    alt: "GitHub security and development features"
    caption: "Securing your GitHub repositories with advanced features. Cover generated with ChatGPT."
---

In my last post, I discussed migrating from Azure DevOps to GitHub. Whether you have just completed the migration or have been using GitHub for a while, GitHub offers many features that you might not be aware of. This guide walks you through five key GitHub features that most teams should configure:

1. **Dependabot** for automated dependency management
2. **Copilot Instructions** for enhanced AI assistance
3. **Push Protection** to prevent secret exposure
4. **Copilot Code Reviews** for automated code quality checks
5. **Dependency Review Actions** to enforce security policies

By implementing these features, you'll create a more secure, efficient, and collaborative development environment.

> **Note:** Some features in this guide require [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security), available on GitHub Enterprise Cloud, Enterprise Server, or GitHub Pro/Team plans.

## 1. Setup Dependabot

[Dependabot](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide) automates dependency management in GitHub with three powerful capabilities:

- **Dependabot alerts**: Notify you when vulnerabilities are detected in your dependencies
- **Dependabot security updates**: Automatically create pull requests to update vulnerable dependencies
- **Dependabot version updates**: Regularly check for newer versions of your dependencies

### Enabling Dependabot

1. Navigate to your repository on GitHub
2. Click **Settings** > **Advanced Security** in the sidebar
3. Under "Dependabot", enable:
   - **Dependabot alerts**
   - **Dependabot security updates**
   - **Dependabot version updates**

### Configuring Version Updates

For more granular control over version updates, create a `.github/dependabot.yml` configuration file:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"  # Supports npm, pip, nuget, maven, etc.
    directory: "/"            # Location of package manifests
    schedule:
      interval: "weekly"      # Daily, weekly, or monthly
    groups:                   # Group all dependencies in one PR
      dependencies:
        patterns:
          - "*"
    # Additional options:
    # open-pull-requests-limit: 5
    # target-branch: "develop"
    # labels:
    #   - "dependencies"
```

Once configured, Dependabot will monitor your dependencies and create automated pull requests like this one:

![Dependabot example PR](/images/posts/dependabot-example.png "Dependabot automatically creating a pull request to update dependencies")
*Dependabot automatically creating a pull request to update dependencies*

### Best Practices

1. **Implement automated testing**: Set up CI/CD pipelines with comprehensive tests to validate Dependabot's changes
2. **Use dependency groups**: Group related updates together to minimize PR noise
3. **Perform periodic reviews**: Dedicate time weekly or bi-weekly for reviewing dependency updates

For advanced configurations, see [GitHub's Dependabot configuration options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file). 

## 2. Create Copilot Instructions

A `.github/copilot-instructions.md` file provides contextual guidance to GitHub Copilot, significantly improving its ability to generate relevant suggestions and understand your project's architecture, coding standards, and domain-specific requirements. This file works across GitHub.com (for code reviews and the coding agent) and in supported IDEs like VS Code.

### Why Copilot Instructions Matter

GitHub Copilot works by understanding context. By providing explicit instructions, you can:

- Ensure code suggestions follow your team's standards
- Improve code quality and consistency
- Reduce the need for corrections and refactoring
- Help new team members understand project conventions

### Creating Effective Instructions

Create a `.github/copilot-instructions.md` file with these key sections:

1. **Project Overview**: Describe the project's purpose and architecture
2. **Coding Standards**: Document style guidelines, patterns, and conventions
3. **Folder Structure**: Explain the organization of code and resources
4. **Libraries and Tools**: Detail key dependencies and how they're used

Here's a template to get started:

```markdown
# Project Overview

This project is a web application that allows users to manage their tasks and to-do lists. It is built using React and Node.js, and uses MongoDB for data storage.

## Folder Structure

- `/src`: Contains the source code for the frontend.
- `/server`: Contains the source code for the Node.js backend.
- `/docs`: Contains documentation for the project, including API specifications and user guides.

## Libraries and Frameworks

- React and Tailwind CSS for the frontend.
- Node.js and Express for the backend.
- MongoDB for data storage.

## Coding Standards

- Use semicolons at the end of each statement.
- Use single quotes for strings.
- Use function based components in React.
- Use arrow functions for callbacks.

## UI guidelines

- A toggle is provided to switch between light and dark mode.
- Application should have a modern and clean design.
```

For more information, see [GitHub's documentation on Copilot instructions](https://docs.github.com/en/copilot/configuring-github-copilot/configuring-github-copilot-in-your-environment#creating-a-githubcopilot-instructionsmd-file-to-provide-additional-context).

## 3. Setup push protection for supported secrets

Secret scanning with push protection is a very powerful security feature. It prevents credentials from being accidentally exposed in your code. This feature blocks pushes containing secrets before they enter your remote repository, avoiding the security risk of sensitive data being stored in your Git history.

### Why Secret Protection Matters

In Git, once data is committed, it remains in the repository history. Even if you later remove a secret from the current version, it can still be accessed in previous commits. Push protection creates a critical security checkpoint before secrets enter your repository.

### How to enable push protection:

1. Navigate to your repository on GitHub
2. Select **Settings** > **Advanced Security**
3. Under "Secret Protection", enable both:
   - **Secret protection**
   - **Push protection**

![GitHub Push Protection Setting](/images/posts/github-push-protection.webp "GitHub's secret scanning and push protection settings")
*GitHub's secret scanning and push protection settings in the repository security configuration*

Once enabled, GitHub will analyze code for secrets before they're pushed to your repository. When a potential secret is detected, the push is blocked with a detailed notification.

### Protected Secret Types

GitHub's push protection detects a wide variety of secrets, including:

- API keys
- Authentication tokens
- Database connection strings
- Private keys
- Passwords and credentials

For a complete, up-to-date list of supported patterns, see [GitHub's documentation on supported secrets](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns#supported-secrets).

### Managing False Positives and Bypasses

Sometimes legitimate code might be flagged as a secret. In these cases:

1. Developers can bypass the protection with a confirmation
2. Team members should be trained to distinguish real secrets from false positives
3. Consider restructuring code to avoid patterns that trigger false positives

### Handling Detected Secrets

If push protection detects a secret:

1. Verify if the secret was previously pushed by checking commit history
2. Remove the secret from your code immediately
3. If the secret was committed but not pushed, reset the commit locally:

```powershell
git reset --mixed HEAD~1  # Undo the last commit but keep changes unstaged
```

4. If the secret was previously pushed, **rotate the secret immediately**. I do not recommend trying to remove it from history using tools like `git filter-repo`, as this can be complex and error-prone. Instead, focus on rotating the secret to ensure it is no longer valid.

For more information, see GitHub's [documentation on secret scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning) and [responding to detected secrets](https://docs.github.com/en/code-security/secret-scanning/managing-alerts-from-secret-scanning).

## 4. Configure Copilot for Code Reviews

GitHub Copilot for PR reviews leverages AI to analyze pull requests, providing automated feedback on code quality, potential bugs, security vulnerabilities, and adherence to best practices. This feature significantly enhances your code review process by providing instant feedback and allowing human reviewers to focus on higher-level concerns.

### Benefits of AI-Powered Code Reviews

- **Instant feedback**: Get immediate code analysis while waiting for human reviewers
- **Consistent quality checks**: Apply the same standards to all pull requests
- **Educational tool**: Help team members learn best practices through actionable suggestions
- **Reduced review burden**: Automate routine checks so human reviewers can focus on architecture and business logic
- **24/7 availability**: Get code review feedback any time, regardless of team member availability

### How to Enable Copilot Code Reviews

1. Navigate to your repository on GitHub
2. Go to **Settings** > **Copilot** > **Code review**
3. Toggle "Copilot for code reviews" to **Enabled**
4. Optionally configure when Copilot reviews are triggered:
   - On every PR
   - When requested with a specific label
   - When requested via a comment

![GitHub Copilot Code Review](/images/posts/github-copilot-pr-review.png "GitHub Copilot providing intelligent code review suggestions")
*GitHub Copilot automatically reviewing pull requests and providing intelligent suggestions for code improvements*

### Maximizing Review Quality

To get the most valuable feedback from Copilot code reviews:

1. **Create a detailed `.github/copilot-instructions.md` file** (as described in section 2)
2. **Keep PRs focused and reasonably sized** - large, complex PRs are harder for both humans and AI to review effectively
3. **Add appropriate PR descriptions** - context helps Copilot provide more relevant suggestions
4. **Incorporate feedback from both AI and human reviewers** - they complement each other

For more information, see [GitHub's documentation on Copilot for PR reviews](https://docs.github.com/en/copilot/concepts/code-review/code-review).

## 5. Implement Dependency Review Automation

Dependency review is a critical security practice that helps prevent vulnerabilities and license compliance issues from entering your codebase. GitHub's dependency review action analyzes pull requests for dependency changes, blocking merges that introduce security risks or non-compliant licenses.

### Why Dependency Reviews Matter

New dependencies can introduce:
- Security vulnerabilities
- License compliance issues
- Supply chain risks
- Performance problems

By automating dependency reviews, you catch these issues during the PR process rather than after code has been merged.

### Setting Up the Foundation

First, enable the necessary security features:

1. Navigate to your repository on GitHub
2. Go to **Settings** > **Advanced Security**
3. Enable these features:
   - **Dependency graph**
   - **Automatic dependency submission**

### Creating a Dependency Review Workflow

Create a file at `.github/workflows/dependency-review.yml` with the following content:

```yaml
name: 'Dependency Review'
on: [pull_request]

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout Repository'
        uses: actions/checkout@v4
      - name: 'Dependency Review'
        uses: actions/dependency-review-action@v4
        with:
          # Block PRs with vulnerabilities of moderate severity or higher
          fail-on-severity: moderate
          # Block PRs with dependencies using these licenses
          deny-licenses: GPL-3.0, LGPL-2.0, AGPL-3.0
```

### Regularly Audit Your Dependency Graph

In addition to PR-time checks, schedule regular reviews of your dependency graph:

1. Visit the **Security** tab in your repository
2. Review the **Dependency graph** section
3. Check **Dependabot alerts** for any active issues
4. Consider running `npm audit`, `yarn audit`, or language-specific tools periodically

For more information, see [GitHub's dependency review action documentation](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review) and [configuration options](https://github.com/actions/dependency-review-action).

## 6. Explore Emerging GitHub Features

GitHub continuously evolves its platform with innovative features that further enhance security, collaboration, and productivity. Here are some capabilities currently in preview that you should keep an eye on:

### Copilot Coding Agent

The [Copilot Coding Agent](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) takes AI assistance to the next level by handling entire coding tasks autonomously. When enabled, you can:

1. Create issues describing the feature or bug fix you need
2. Assign the issue to the Copilot Coding Agent
3. Let the agent analyze your codebase and implement a solution
4. Review the automatically generated pull request

This agent is particularly effective for:
- Implementing routine features
- Creating tests for existing functionality
- Updating dependencies across multiple files
- Refactoring code according to new patterns

### GitHub Spark

[GitHub Spark](https://githubnext.com/projects/github-spark) is an innovative tool for rapidly creating functional micro-applications without writing traditional code or handling deployments. It allows you to:

- Quickly prototype ideas
- Create interactive data visualizations
- Build simple internal tools
- Test concepts before full implementation

Spark uses natural language to generate applications, making it accessible to both developers and non-technical team members.

### Copilot Spaces

[Copilot Spaces](https://github.com/features/preview/copilot-spaces) represents the future of collaborative development environments. This feature creates shared workspaces where:

- Teams can collaborate in real time
- Copilot provides contextual assistance to the entire team
- Code discussions happen alongside implementation
- Knowledge is shared more efficiently across team members

## Conclusion

Implementing these GitHub features creates multiple layers of protection and efficiency for your development process. From automated dependency management to AI-powered code reviews, these tools work together to create a more secure, collaborative, and productive environment.

Remember that security is an ongoing process, not a one-time setup. Regularly review your security settings, keep tools updated, and stay informed about emerging best practices in software security.

Cheers,\
Lucas