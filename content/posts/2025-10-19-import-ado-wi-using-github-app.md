---
layout: post
title: "Importing Azure DevOps work items to GitHub using a GitHub App"
date: 2025-10-19
categories:
  - DevOps
description: >-
    Learn how to use the adowi2gh tool with GitHub Apps for seamless Azure DevOps work item migration with proper organizational attribution
cover:
    image: "/images/posts/github-imported-issue.png"
    alt: "Importing ADO work items to GitHub using adowi2gh and a GitHub App"
    caption: "Importing ADO work items to GitHub using adowi2gh and a GitHub App"
---

When migrating from Azure DevOps to GitHub, one of the most challenging tasks is importing work items as GitHub Issues. While [Personal Access Tokens (PATs)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) work well for individual migrations, organizational migrations often require a more professional approach using [GitHub Apps](https://docs.github.com/en/apps/overview).

I've been developing [adowi2gh](https://github.com/jlucaspains/adowi2gh), an open-source CLI tool designed specifically for importing Azure DevOps work items into GitHub Issues. With the recent release of version 0.1.0, the tool now supports GitHub App authentication, enabling better organizational control and attribution.

## Why use GitHub Apps for work item migration?

When you use a Personal Access Token for importing work items, all created issues and comments are attributed to the personal account of the PAT:

![Example of an imported work item using PAT](/images/posts/github-issue-example.png)

This approach has the following limitations in organizational contexts:

- **Attribution confusion**: All imported issues appear to be created by your personal account
- **Permission dependencies**: The migration depends on your individual access rights
- **Audit trail concerns**: Organizational activity appears tied to personal accounts

GitHub Apps solve these problems by:
- Creating issues under a dedicated app identity
- Operating independently of individual user permissions
- Providing clear organizational attribution for automated processes
- Enabling better security and access control

## Setting up a GitHub App for adowi2gh

Follow these steps to create and configure a GitHub App for work item migration:

### 1. Create a GitHub App

Navigate to your organization's or personal account's [Developer settings](https://github.com/settings/developers) and create a new GitHub App:

1. Click **"New GitHub App"**
2. Fill in the required information:
   - **App name**: Choose a descriptive name (e.g., "ADO Work Item Importer")
   - **Description**: Brief description of the app's purpose
   - **Homepage URL**: Can be your organization's website or the adowi2gh repository

> **Pro tip**: Upload a custom icon for your app. If you don't provide one, GitHub will use the app creator's avatar by default.

![Creating a new GitHub App](/images/posts/github-create-app.png)

### 2. Configure app permissions

Your GitHub App needs specific permissions to create and manage issues. Configure the following permissions in the app settings:

- **Repository permissions**:
  - **Issues**: Read & Write (required to create and update issues)
  - **Metadata**: Read (required for basic repository access)

![Setting GitHub App permissions](/images/posts/github-app-permissions.png)

For more information about GitHub App permissions, see [GitHub's App permissions documentation](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app).

### 3. Install the app on your repositories

After creating the app, you need to install it on the target repositories where you want to import work items:

1. Navigate to your app's settings page
2. Click **"Install App"** in the left sidebar
3. Choose the account (organization or personal) where you want to install the app
4. Select the repositories where the app should have access:
   - **All repositories**: Grants access to all current and future repositories
   - **Selected repositories**: Choose specific repositories for more granular control

![Installing the GitHub App](/images/posts/github-install-app.png)

![Installing the GitHub App](/images/posts/github-install-app-permissions.png)

> **Security note**: Follow the principle of least privilege and only grant access to repositories that need work item imports.

### 4. Generate and secure your private key

GitHub Apps can either authenticate on behalf of a user, or as an app installation. The second authentication method attributes activities to the app itself and not to a user. To authenticate as an app installation, a private key is needed:

1. In your app's settings, scroll down to **"Private keys"**
2. Click **"Generate a private key"**
3. Download the generated `.pem` file
4. Store the file securely on your local machine

![Generating a private key for the GitHub App](/images/posts/github-generate-private-key.png)

> **Critical security warning**: Never commit private key files to source control. Store them securely and restrict access to authorized personnel only.

### 5. Gather required credentials

You'll need three pieces of information to configure adowi2gh with your GitHub App:

1. **App ID**: Found in your app's settings page under "About"
2. **Installation ID**: Found in the URL when viewing your app installation (e.g., `https://github.com/settings/installations/12345678`)
3. **Private key file path**: The location where you saved the `.pem` file

For detailed information about GitHub App authentication, see [GitHub's authentication documentation](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app).

## Using adowi2gh with GitHub App authentication

Now that your GitHub App is configured, you can use it with adowi2gh for work item migration.

### Installation

Install the latest version of adowi2gh using Go:

```powershell
go install github.com/jlucaspains/adowi2gh/cmd/adowi2gh@latest
```

### Configuration

Create a configuration file that uses GitHub App authentication instead of a Personal Access Token. Here's an example basic configuration:

```yaml
azure_devops:
  organization_url: "https://dev.azure.com/your-organization"
  personal_access_token: "your-ado-pat-token"
  project: "your-project-name"
  
  query:
    work_item_types:
      - "Bug"
      - "User Story"
    states:
      - "New"
      - "Active"
      - "Done"

github:
  app_certificate_path: ./configs/adowi2gh.pem
  app_id: 1234567
  installation_id: 7654321
  owner: "repository-owner-name"
  repository: "repository-name"

migration:
  batch_size: 25
  include_comments: true
  
  field_mapping:
    state_mapping:
      "New": "open"
      "Active": "open"
      "Done": "closed"
    
    type_mapping:
      "Bug": ["bug"]
      "User Story": ["enhancement"]

  user_mapping:
    "john.doe@company.com": "johndoe"
    "jane.smith@company.com": "janesmith"

```

### Running the migration

1. **Test your configuration** with a dry run:
   ```powershell
   adowi2gh migrate --config .\configs\config.yaml --verbose --dry-run
   ```

2. **Execute the migration**:
   ```powershell
   adowi2gh migrate --config .\configs\config.yaml --verbose
   ```

3. **Verify the results** by checking your GitHub repository for newly created issues

## Next steps

For comprehensive migration guidance, including repository and pipeline migration, check out my [complete guide to moving from Azure DevOps to GitHub](/posts/2025-08-03-guide-move-to-github/).

For detailed configuration options and advanced features, refer to the [adowi2gh documentation](https://github.com/jlucaspains/adowi2gh/blob/main/README.md).

Cheers,\
Lucas
