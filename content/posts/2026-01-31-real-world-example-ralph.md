---
layout: post
title: "Real World Example: Building a Production Feature with Ralph Wiggum Loop"
date: 2026-01-31
categories:
  - DevOps
  - AI
  - Automation
description: >-
    A practical case study of using the Ralph Wiggum Loop AI agent pattern to build a production feature for Sharp Cooking. Learn how autonomous AI agents can accelerate development, the challenges encountered, and best practices for creating effective specs and documentation.
cover:
    image: "/images/posts/ralph-wiggum-loop.png"
    alt: "Ralph Wiggum Loop autonomous AI agent development"
    caption: "Autonomous AI development with Ralph Wiggum Loop"
---

I heard about Ralph Wiggum as a Software Engineer a couple of months ago from [Geoffrey Huntley's article](https://ghuntley.com/ralph/). The idea was intriguing and I wanted to build something real with it. At the same time, I've had a feature on the backlog of [Sharp Cooking](https://github.com/jlucaspains/sharp-cooking-web) for about a year now. I knew it wasn't an easy one and it was never a critical feature either. What a great opportunity!

I highly recommend reading the [original article](https://ghuntley.com/ralph/) as well as the [snarktank/ralph implementation](https://github.com/snarktank/ralph) that was created since. The idea is simple yet powerful: create a detailed spec, set up the AI agent, let it run and **learn** in an autonomous loop until it completes the spec implementation. This post documents my experiment that became a production feature.

Note: This post focuses on GitHub Copilot usage. You may use Claude Code with the tooling described in this post but the commands and usage will vary to some extent.

## How to Run Ralph
To get started, I used [snarktank/ralph](https://github.com/snarktank/ralph) to set up my repo with the necessary skills and prompt. However, my license for [GitHub Copilot](https://github.com/features/copilot) allows me a very high number of premium requests so I wanted to use it instead of [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Snarktank's implementation does not support GitHub Copilot and it also uses bash which only works on Linux/Mac, unless you want to run it on Windows with [WSL2](https://learn.microsoft.com/en-us/windows/wsl/). Thus, I ported the bash version to a Go version that can be easily installed on Linux, Mac, and Windows with `go install github.com/jlucaspains/go-ralph@v1.0.0-alpha1`. I also added an init option and adjusted the structure to better suit my needs. You can review my implementation at [jlucaspains/go-ralph](https://github.com/jlucaspains/go-ralph).

With go-ralph, you simply:

```bash
go install github.com/jlucaspains/go-ralph@v1.0.0-alpha1

cd project-location

go-ralph --init --tool copilot
```

The repo is now initialized and contains a folder called `.ralph` with the `prompt.md` appropriate for the chosen tool. Additionally, the skills for PRD generation and PRD conversion are created in the `.github` folder—more on that coming up. 

First, create a spec in markdown using GitHub Copilot CLI:

```bash
Use the prd-generator skill to create a spec for...
```

Convert it to the YAML format go-ralph expects:

```bash
use the prd-converter to convert @prd.md to prd.yaml
```

Once you have a `prd.yaml` inside the `.ralph` folder, run:

```bash
go-ralph
```

## What to Add to AGENTS.md
I highly recommend you create an `AGENTS.md` file in your project root. Ralph will add important information to it at the end of each loop, but if you provide critical information early, Ralph will perform better. You should include:

1. **Architecture details** - High-level overview of your application structure
2. **Patterns to use and anti-patterns to avoid** - Coding standards and conventions specific to your project
3. **Testing and feature validation** - How to create and run tests to validate features
4. **Scripts and tools available** - Commands to build, run, and test the project

## How to Create a Good Spec
The first Ralph loop I ran produced, frankly, terrible results. The spec was not great and the results followed. There is some difference between the AI models here, but in general what was missing for me was:

1. **Review AI-generated specs thoroughly** - If you create the spec with an AI model (you really should), review the generated spec in detail. Depending on the model, it might miss important details or add unnecessary features.
2. **Define explicit completion criteria** - In each User Story, explicitly declare what is critical to consider it complete: "The button shows in the page", "When clicked it does x", "The build should pass", "Create tests for X", "Use Playwright to visually inspect the page", "Use styling Y", etc.
3. **Specify non-negotiable requirements** - Define what's non-negotiable in the spec. I wanted the new feature to be a new page but didn't specify that clearly. The first loop provided a popup with way too much information in it. That said, you want to find balance between the detail you provide and what the AI can decide on its own.

## Thoroughly Review the Output
Treat Ralph as a very capable junior engineer. It will follow your instructions but it will also create things that you did not expect or want. In my example, SonarCloud found many code smells such as invalid function calls and unused imports. These did not break the build so Ralph missed fixing them. Additionally, it didn't use the existing notification framework or follow styling consistently. A combination of a better `AGENTS.md` and thorough code review should suffice to improve on this.

## What Is the Cost and How Much Time Did It Save?
Because each iteration runs a new instance of [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli), it will consume at least 1 premium request per iteration. For this feature, each execution consumed 15-20 premium requests and I ran it 5 times. At worst, it consumed 100 premium requests total.

I estimate the full manual coding would have taken me about 15-20 hours in total. Given I wanted to watch Ralph closely, I spent approximately 6 hours to create the spec, make adjustments, run Ralph several times until it got close enough, manually fix tests, and conduct manual testing. I believe that future features would be even faster as the project now has AI-ready documentation and I've learned where to focus my time to make it more efficient.

**Time savings: ~60% reduction** (from 15-20 hours to 6 hours)

## Want to See the Code?
You can review the full pull request including Ralph iterations and my manual adjustments at [Sharp Cooking Repo - PR #487](https://github.com/jlucaspains/sharp-cooking-web/pull/487).

## Closing Thoughts
This was a valuable exercise that demonstrated the power of Ralph loops for autonomous AI development. A few important takeaways:

1. **Prepare AI-ready documentation** - Have AI-ready documentation in your project. Ralph will create it as it iterates, but it will be more effective if you provide foundational information early.
2. **Focus on spec quality and review** - Spend most of your time on the spec and then on reviewing the generated output and feature. Let Ralph do its iterations autonomously.
3. **Customize the prompt** - go-ralph comes with a starting prompt—customize it for each project's unique needs.
4. **Restrict tool access carefully** - Be careful which tools you allow the AI to use. Ralph attempted to push to the remote repository and run unnecessary tools. I highly recommend not running it with `--allow-all-tools`.
5. **Set realistic expectations** - Ralph is not a silver bullet. Like any other AI tool, it will greatly improve your workflow, but it can't build and ship the feature by itself. At least not yet.

The Ralph Wiggum Loop pattern is a powerful technique for accelerating development, especially for features that are well-defined but time-consuming to implement manually. With proper setup and oversight, it can significantly improve developer productivity while maintaining code quality.

Cheers,\
Lucas