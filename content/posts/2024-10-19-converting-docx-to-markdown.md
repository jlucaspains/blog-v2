---
layout: post
title: "How to convert DOCX files to Azure DevOps wiki using Documorph"
date: 2024-10-19
categories:
  - util
  - documorph
description: >-
    Converting Word documents to markdown for your Azure DevOps wiki doesn't have to be a hassle. In this post, I will show you how to do just that using Documorph.
cover:
    image: "/images/posts/documorph-post-wiki-result.png"
    alt: "Docx to Markdown"
    caption: "Docx to Markdown"
---

Azure DevOps wikis provide a simple and effective way to document your projects. Personally, I love how easy they are to create and maintain. Plus, you get built-in search and the ability to manage your wiki using Git.

However, if you already have documentation in Word documents, converting them to markdown for wiki use can be a bit tricky.

That’s where Documorph comes in. Documorph is an open-source .NET global tool that converts `.docx` files to formats like Markdown and AsciiDoc. In this post, I’ll walk you through how to convert DOCX files for your Azure DevOps wiki using Documorph.

## Prerequisites
Before we begin, make sure you have:

* An Azure DevOps account.
* A project with a wiki.

If you don’t have an account, you can create a free one [here](https://azure.microsoft.com/en-us/services/devops/).

## Clone the wiki locally
Did you know that Azure DevOps wikis are also Git repositories? This makes it easy to clone your wiki locally and make changes. Here’s how you can do it:

```bash
git clone https://<your-organization>@dev.azure.com/<your-organization>/<your-project>/_git/<your-wiki>.wiki
```

Replace `<your-organization>`, `<your-project>`, and `<your-wiki>` with the actual names.

## Install Documorph
To install Documorph, use the following command:

```bash
dotnet tool install --global lpains.documorph.cli --prerelease
documorph --version
```

Make sure the version prints correctly to confirm the installation.

## Convert the DOCX file to Markdown

Documorph makes it easy to convert a single DOCX file or even an entire folder of DOCX files to markdown. For each DOCX file, it will create a corresponding markdown file and copy any media files to the specified location.

Azure DevOps automatically creates a `.attachments` folder in the root of your wiki repository to store media files, so it’s best to use that for storing images or other assets.

Convert a Single DOCX File:
```bash
documorph md --in "path/to-docx-file.docx" --out "path/to-your-wiki-repo/output-file.md" --media-location "path/to-your-wiki-repo/.attachments/"
```

Convert a Folder of DOCX Files:
```bash
documorph md --in "path/to-folder/" --out "path/to-your-wiki-repo/" --media-location "path/to-your-wiki-repo/.attachments/"
```

After running these commands, you should see the tool's output:

![Documorph output and git status](/images/posts/documorph-md-git.png)

The converted markdown file should look like below:
![Conversion result](/images/posts/documorph-example-md.png)

## Push the changes to Azure DevOps

Once the files are converted, you can commit and push the changes to your Azure DevOps wiki repository:

```bash
git add .
git commit -m "Converted DOCX files to markdown"
git push
```

![Conversion wiki repo push](/images/posts/documorph-git-push.png)

## Review the changes in Azure DevOps

Finally, head over to your Azure DevOps project and check the wiki to review your changes.

![Azure DevOps updated wiki result](/images/posts/documorph-post-wiki-result.png)


## Conclusion
Converting Word documents to markdown for your Azure DevOps wiki doesn't have to be a hassle. With Documorph, the process is streamlined, allowing you to easily integrate existing documentation into your wiki. By following the steps outlined in this post, you can quickly convert, commit, and review your changes, making it simpler to keep your project documentation up to date and accessible.

Cheers,\
Lucas