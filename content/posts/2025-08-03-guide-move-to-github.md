---
layout: post
title: "Guide to moving to GitHub from Azure DevOps"
date: 2025-08-03
categories:
  - DevOps
description: >-
    A comprehensive guide with best practices and instructions for migrating from Azure DevOps to GitHub Enterprise Cloud
cover:
    image: "/images/posts/move-from-ado-to-github.png"
    alt: "Making the switch from Azure DevOps to GitHub"
    caption: "Making the switch from Azure DevOps to GitHub"
---

In [my previous post](/posts/2025-06-18-time-to-move-to-github/), I explained why many Azure DevOps users should consider moving to GitHub. This guide will help you make that transition smoothly and efficiently.

This post focuses on helping you make informed decisions throughout the migration process. Rather than providing exhaustive step-by-step details for every scenario, I'll highlight key considerations and link to official documentation where appropriate. I'll also share my recommendations on what to move, how to structure your GitHub organization, and which migration approaches to use.

> **Note:** This guide assumes you're migrating from Azure DevOps (ADO) to GitHub Enterprise Cloud, that you're familiar with both platforms, and that you have administrative access to both your ADO and GitHub accounts.

## 1. Define what to move

Before beginning any migration, take inventory of your Azure DevOps assets:
- Repositories and their history
- CI/CD pipelines
- Work items (user stories, bugs, tasks)
- Wiki content
- Artifacts and packages

Ask yourself: Do you really need to migrate that repository with no activity in the past two years? Or that pipeline no one uses anymore? Carefully review your Azure DevOps projects and repositories to determine what's essential to move to GitHub.

**Recommendation:** Avoid migrating historical data that isn't truly required. Leave old project work items, inactive repositories, outdated wikis, and unused artifacts in Azure DevOps. By migrating only actively used items, you'll maintain a clean and well-organized GitHub environment.

## 2. Understand GitHub Organization vs Azure DevOps Project structure

This is where most teams encounter conceptual challenges. In Azure DevOps, collaboration primarily happens at the project level, while repositories are mainly for code. Work Items, Test Plans, Wiki, packages—all these are bound to the project.

In GitHub, collaboration happens at the repository level instead. Issues, Projects, Discussions, Wiki, and other collaboration tools are all attached to specific repositories, not to broader organizational structures.

### What's the ideal GitHub structure?

While no single structure fits all organizations, consider these [best practices from GitHub](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/best-practices-for-organizations):

- **Use a single GitHub Organization** for your company when possible. This enables better collaboration and more effective account management.
- **Consider multiple organizations only** when your projects have distinct security/compliance requirements. For example:
  - When no single owner should have access to all repositories
  - When different repository management policies are required
  - When different spending limits must be applied to different groups

### Where should you import ADO work items and wiki?

Since GitHub doesn't have an exact equivalent to ADO projects, you need to decide where to migrate your work items and wiki content. Your approach should depend on the number of repositories in the project:

- **Single repository project:** Import ADO work items into that repository's Issues
- **Multiple repository project:** Choose one of these options:
  - Create a dedicated repository for the project's issues and wiki, or
  - Select one primary repository to host these elements

**Pro tip:** GitHub allows you to [reference issues from any repository](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) in pull requests, discussions, and wikis. You might also consider using [monorepos](https://www.atlassian.com/git/tutorials/monorepos), which allow multiple projects to exist within a single repository.

## 3. Design your teams and permissions structure

When using the [GitHub Enterprise Importer tool](https://docs.github.com/en/migrations/using-github-enterprise-importer), teams and permissions are not automatically migrated from Azure DevOps to GitHub. You'll need to set these up manually after migration.

GitHub supports [nested teams](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams#nested-teams), which allow for hierarchical permission structures. Consider creating a structure where the highest-level teams have limited access, with more specific permissions at lower levels in the hierarchy.

**Example of a nested team structure:**
```
Organization
├── Everyone (limited access)
│   ├── Project 1 team
│   │   ├── Engineering Team
│   │   ├── Operations Team
│   │   └── Product Team
│   ├── Project 2 team
│   │   ├── Engineering Team
│   │   └── Operations Team
│   └── Cross-Project Team
│       └── Security Team
```

This structure creates a clear hierarchy and makes permission management more straightforward across your organization.

## 4. Organize your repositories

GitHub doesn't offer a direct equivalent to Azure DevOps project-based repository grouping. However, you can achieve similar organization using a combination of GitHub features:

1. **Team-based access control**: Create [teams for logical project groups](https://docs.github.com/en/organizations/organizing-members-into-teams/creating-a-team) and assign repository access to those teams.

2. **Repository topics**: Use [topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics) to categorize and tag repositories with common themes, making them easily discoverable.

3. **Organization search**: The organization's repository page (typically https://github.com/orgs/your-org/repositories) provides powerful filtering by topic, name, and other attributes.

4. **GitHub Projects**: Create [organization-level projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/creating-projects/creating-a-project) to track work across multiple repositories.

## 5. Choose your repository migration strategy

You have two main options for migrating repositories:

### Option 1: Manual Git migration
Like any Git repository, you can manually change the remote origin to point to GitHub and push the code. This approach:
- Preserves commit history
- Is quick and straightforward
- Does NOT include pull requests or branch policies

### Option 2: GitHub Enterprise Importer
For Azure DevOps Cloud users, [GitHub Enterprise Importer](https://docs.github.com/en/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/about-migrations-from-azure-devops-to-github-enterprise-cloud) offers a more comprehensive import experience:
- Preserves commit history
- Migrates pull request history
- Recreates branch policies

**Important note**: Regardless of which approach you choose, Work Items, Pipelines, and Wiki content will not be migrated automatically. You'll need to use additional tools or manual processes to migrate these assets, which we'll cover in subsequent sections.

## 6. Migrating repositories

### Using GitHub Enterprise Importer (GEI)

If you've decided to use GitHub Enterprise Importer to migrate both repositories and pull request history:

1. Install the [GitHub CLI](https://cli.github.com/) if you haven't already
2. Follow the [official GitHub Enterprise Importer documentation](https://docs.github.com/en/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/migrating-repositories-from-azure-devops-to-github-enterprise-cloud)
3. Run the migration command (basic example):
   ```powershell
   gh ado2gh migrate-repo --ado-org "your-ado-org" --ado-team-project "your-project" --ado-repo "your-repo" --github-org "your-github-org" --github-repo "your-new-repo"
   ```

### Manual Git repository migration

If you prefer a simpler approach and only need to migrate the repository code without pull request history:

1. [Create a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) in GitHub
2. Clone the Azure DevOps repository locally:
   ```powershell
   git clone https://dev.azure.com/your-org/your-project/_git/your-repo
   cd your-repo
   ```
3. Add the GitHub repository as a remote and push all content:
   ```powershell
   git remote add github https://github.com/your-org/your-new-repo.git
   git branch -M main
   git push -u github
   ```
4. Configure [repository permissions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository) and [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

## 7. Migrating work items

Unlike repositories, there's no official tool from GitHub for migrating work items from Azure DevOps to GitHub Issues. You'll need a specialized migration tool for this task.

I've developed [adowi2gh](https://github.com/jlucaspains/adowi2gh), an open-source CLI tool with various options to handle work item migration. While still in active development, it supports most common migration scenarios.

### Using adowi2gh to migrate work items

1. **Install the tool** via Go (you will need Go installed locally):
   ```powershell
   go install github.com/jlucaspains/adowi2gh/cmd/adowi2gh@v0.0.1-preview
   ```

2. **Create a configuration file**:
   ```powershell
   adowi2gh config init
   ```

2. **Configure authentication**:
   - For Azure DevOps: Use a [Personal Access Token (PAT)](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) with Work Items Read permissions
   - For GitHub: Use a [Personal Access Token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with repo and project permissions

3. **Adjust the configuration file**:
   1. Add the PATs
   2. Configure the Source ADO organization and project, and the Target GitHub organization and repository
   3. Adjust the migration settings as needed, such as:
      - Source Azure DevOps organization and project
      - Target GitHub organization and repository
      - Work item query to filter items to migrate
      - User mapping from ADO to GH.
      - State and Label mappings.

4. **Dry-run the migration**:
   ```powershell
   adowi2gh migrate --config .\configs\config.yaml --verbose --dry-run
   ```

5. **Run the migration**:
   ```powershell
   adowi2gh migrate --config .\configs\config.yaml --verbose
   ```

6. **Verify the migration** by checking the newly created GitHub Issues

For more advanced options, refer to the [adowi2gh documentation](https://github.com/jlucaspains/adowi2gh/blob/main/README.md).

## 8. Migrating wikis

GitHub wikis differ from Azure DevOps wikis in several important ways:

| Feature | Azure DevOps Wiki | GitHub Wiki |
|---------|------------------|------------|
| Association | Bound to a project | Bound to a repository |
| Page hierarchy | Supports nested folders | Flat structure only |
| Attachments | Supports `.attachments` folder | No attachment folder (images must be uploaded directly) |
| Markdown syntax | Microsoft flavor | GitHub flavor |

Due to these differences, wiki migration requires a manual approach. Automated solutions often produce unreliable results, especially with complex wikis.

### Step-by-step wiki migration process

1. **Clone the Azure DevOps wiki repository**:
   ```powershell
   git clone https://dev.azure.com/your-org/your-project/_git/your-project.wiki
   ```

2. **Choose where to host your GitHub wiki**:
   - Option A: Use an existing repository's wiki
   - Option B: Create a dedicated repository for wiki and issues (recommended for large wikis)

3. **Create the initial wiki page in GitHub**:
   - Navigate to your repository → Wiki → Create the first page
   - GitHub wikis can't be cloned until at least the home page exists

4. **Clone the GitHub wiki repository**:
   ```powershell
   git clone https://github.com/your-org/your-repo.wiki.git
   ```

5. **Copy and adapt content**:
   - Copy markdown files from ADO wiki to GitHub wiki folder
   - Do NOT copy the `.attachments` folder (unsupported in GitHub)
   - Flatten the folder structure (GitHub wikis don't support hierarchy)
   
6. **Fix attachment references**:
   - For each file reference in the `.attachments` folder:
     - Upload the file to your repository directly or to another storage location
     - Update the links to point to the new location

7. **Upload images**:
   - Push your changes to GitHub
   - Edit pages containing images
   - Use drag-and-drop to upload images directly into the wiki editor
   - Save the pages with the newly embedded images

8. **Verify all links and formatting**:
   - Check navigation between pages
   - Ensure all images display correctly
   - Test any code snippets or special formatting

For more information, see [GitHub's documentation on wikis](https://docs.github.com/en/communities/documenting-your-project-with-wikis/about-wikis).

## 9. Migrating packages

Package migration varies significantly based on the package type you're using. GitHub Packages currently supports these package types:

- NuGet
- npm
- RubyGems
- Maven
- Docker
- Gradle

**Important compatibility note:** Universal packages, Python packages, and Cargo packages from Azure Artifacts are **not supported** in GitHub Packages. For these formats, consider using a public package registry or another hosting solution.

### Migrating NuGet packages (example)

Here's a detailed process for migrating a NuGet package from Azure Artifacts to GitHub Packages:

1. **Create a `nuget.config` file to use your Azure DevOps feed** (refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/azure/devops/artifacts/nuget/nuget-exe?view=azure-devops) for details)

2. **Download the package from Azure DevOps**:
   ```powershell
   nuget install YourPackageName -Version 1.0.0 -Source AzureArtifacts -OutputDirectory ./packages
   ```

3. **Repack the package with updated metadata**:
   - Extract the NuGet package (it's a ZIP file with a different extension)
   - Update the `.nuspec` file with the new repository URL, project URL, and package name
   - Pack it again:
   ```powershell
   nuget pack ./extracted-package/YourPackageName.nuspec -OutputDirectory ./repacked
   ```

4. **Create a `nuget.config` file for using GitHub Packages** (refer to [GitHub's NuGet registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-nuget-registry)):

5. **Publish to GitHub Packages**:
   ```powershell
   nuget push ./repacked/YourPackageName.1.0.0.nupkg -Source GitHub -ConfigFile github-nuget.config
   ```

For additional information on other package types, refer to [GitHub Packages documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry).

## 10. Migrating pipelines

To migrate your Azure DevOps pipelines to GitHub Actions, the [GitHub Actions Importer](https://docs.github.com/en/actions/migrating-to-github-actions/automating-migration-with-github-actions-importer) tool is the recommended approach. This official tool helps convert your Azure Pipelines YAML definitions into equivalent GitHub Actions workflows.

> **Note:** you will need Docker and the GitHub CLI to be installed in order to use GH Actions Importer

### GitHub Actions Importer process

1. **Install the GitHub Actions Importer CLI**:
   ```powershell
   gh extension install github/gh-actions-importer
   ```

2. **Authenticate with Azure DevOps and GitHub**:
   ```powershell
   gh actions-importer configure
   ```

3. **Perform an audit** to understand conversion complexity:
   ```powershell
   gh actions-importer audit azure-devops -o ./audit-results
   ```

4. **Convert a specific pipeline**:
   ```powershell
   gh actions-importer forecast azure-devops -o ./forecast-results
   ```

5. **Migrate the pipeline**:
   ```powershell
   gh actions-importer migrate azure-devops -o ./migrate-results
   ```

6. **Review and adjust** the generated workflow files:
   - You'll need to manually configure [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) for sensitive values
   - Update environment variables and service connections
   - Check for any custom tasks that might need replacement

For a practical demonstration, see this [video tutorial](https://www.youtube.com/watch?v=gG-2bkmBRlI&ab_channel=EthanDennis).

## 11. Managing legacy Azure DevOps projects

After successfully migrating your content to GitHub, you'll likely want to preserve your Azure DevOps projects for historical reference while preventing further modifications.

Azure DevOps doesn't provide a direct "archive" feature, but you can effectively achieve the same result by:

1. **Remove write permissions** for all users except administrators:
   - Navigate to Project Settings > Permissions
   - For each security group, set appropriate permissions to "Deny" for modifying content

2. **Document the migration** by adding a README or project description pointing users to the new GitHub location

## Best practices: My opinionated migration rulebook

Here's my recommended approach for a smooth transition:

1. **Keep your organizational structure simple** - Use a single GitHub Organization for most companies, or a small number of organizations for very large enterprises with distinct security boundaries.

2. **Be selective about what you migrate** - Archive inactive projects in Azure DevOps rather than cluttering your new GitHub environment with obsolete content.

3. **Balance history vs. complexity** - Migrate full Git commit history, but consider leaving pull request history behind unless it's critical for compliance or reference.

4. **Focus on active work items** - Migrate only New or In Progress work items to keep your GitHub Issues focused on current work.

5. **Organize cross-repository content effectively** - For multi-repository Azure DevOps projects, create a dedicated GitHub repository for issues and wiki content.

6. **Design permissions for the future** - Use hierarchical teams in GitHub to create a clear permissions model that will scale as your organization grows.

7. **Handle wikis with care** - Plan your wiki migration carefully, considering the structural differences between platforms, and accept that this will likely be a manual process.

8. **Streamline your artifacts** - Audit your packages before migration and only move currently used versions to maintain a clean package registry.

### Next steps

This guide provides a foundation for your migration from Azure DevOps to GitHub. Each organization's needs will vary, so adapt these recommendations to your specific requirements. The most successful migrations happen incrementally, with careful planning and testing at each stage. Consider starting with a small, non-critical project to build confidence in your migration process.

For more guidance, check out [GitHub's official migration resources](https://docs.github.com/en/migrations) and consider engaging with the [GitHub Community Forum](https://github.community/) to learn from others' experiences.

Cheers,\
Lucas