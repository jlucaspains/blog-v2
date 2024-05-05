---
layout: post
title: "Introducing documorph"
date: 2024-05-05
categories:
  - util
  - announcement
description: >-
    I'm excited to share documorph – a dotnet tool simplifying the conversion of Microsoft Word docs to markdown.
cover:
    image: "/images/posts/docx2md.png"
    alt: "documorph"
    caption: "Converting .docx to .md with documorph"
---

Let’s face it – writing documentation isn’t always enjoyable and can often feel like a daunting task. It comes in various formats, from a simple README to more comprehensive guides. Personally, I favor markdown and wiki-style documentation because it’s usually closely tied to the code and easy to manage.

One common approach to documentation is maintaining a library of Microsoft Word documents. However, these documents are often disjointed, difficult to search, and may lack consistency in style. Converting from Word to markdown isn’t always straightforward and can be time-consuming. Enter documorph – a dotnet global tool designed to simplify the conversion of Microsoft Word documents to markdown files. It also extracts any media files and links them to the markdown files. With documorph, you can effortlessly convert an entire library of docs and upload them to platforms like Azure DevOps wiki, GitHub wiki, or any other markdown-based documentation repository.

Here is how to get started with documorph:

1. **Installation**: Install the tool using the following command:

```powershell
dotnet tool install --global lpains.documorph.cli --prerelease
```

2. **Conversion**: Convert a Word document to markdown using the command:

```powershell
# inputFile should be a Word document .docx file
# outputFile should be a markdown file .md
documorph md --in <inputFile> --out <outputFile> [-?, -h, --help]
```

In addition to the dotnet global tool, documorph also provides a dotnet 8 library for direct integration into your code.

1. **Library Installation**: Install the library using the following command:

```powershell
dotnet add package lpains.documorph --prerelease
```

2. **Usage**: Use the library to convert a Word document to markdown:

```csharp
// Create an instance of the DocxToMarkdownProcessor class. This class requires the .docx file path.
var processor = new DocxToMarkdownProcessor(source.FullName);

// Invoke the Process() method which returns the markdown content and media files.
var (markdown, media) = processor.Process();
```

Whether through the CLI or the package, documorph ensures CommonMark compliant output as can be seen in the post cover.

Documorph is open source and available on GitHub at [jlucaspains/documorph](https://github.com/jlucaspains/documorph) under the [MIT license](https://github.com/jlucaspains/documorph?tab=MIT-1-ov-file#readme). It is still in the early stages of development, so feedback is greatly appreciated. If you have any questions or suggestions, feel free to open an issue on GitHub.

Cheers,\
Lucas