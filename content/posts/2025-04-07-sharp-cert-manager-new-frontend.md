---
layout: post
title: "Why I removed Svelte from Sharp Cert Manager"
date: 2025-04-07
categories:
  - golang
  - containers
description: >-
    I recently removed Svelte from Sharp Cert Manager and replaced it with a simple Golang HTML template and HTMX. Here is why and how I did it.
cover:
    image: "https://github.com/jlucaspains/sharp-cert-manager/raw/main/docs/demo.jpeg"
    alt: "Sharp Cert Manager"
    caption: "Sharp Cert Manager"
---

I've been a fan of [Svelte](https://svelte.dev/) for a while. It's fast, elegant, and works nicely with SvelteKit. But like any tool, it comes with maintenance overhead. For larger applications, that overhead is worth it. But for smaller projects—like Sharp Cert Manager, which only has a single page and a popup—the cost felt too high. In fact, I found myself spending more time upgrading Svelte or Vite than it would take to simply rewrite the page. So, I decided it was time for something simpler. The frontend for Sharp Cert Manager is intentionally minimal and I don’t expect that to change. All I really need is a page that lists monitored certificates and a popup with their details.

## A Simpler Approach

When choosing a replacement, I looked for something native to [Go](https://go.dev/). I ended up using Go's built-in [html/template](https://pkg.go.dev/html/template) package along with [HTMX](https://htmx.org/) for interactivity. HTMX allows you to work directly with HTML and server responses, avoiding the need for JavaScript frameworks or build systems.

I also kept [TailwindCSS](https://tailwindcss.com/), but instead of a full build setup, I used the [Tailwind standalone CLI](https://tailwindcss.com/blog/standalone-cli) to generate the CSS.

### Why this stack works:
1. Go templates: Keep things simple and fast with no extra dependencies.
1. HTMX: Handles small bits of interactivity without writing JavaScript.
1. Tailwind CLI: No need for npm or a bundler—just generate your CSS.

## New Implementation
The new implementation introduces a few endpoints:

1. `/`: loads the index.html template with placeholders for each certificate and a loading indicator.
2. `/item?name={name}`: returns a small HTML snippet with certificate status. This is loaded into the main index page.
3. `/itemModal?name={name}`: returns a modal containing full certificate details.

## HTMX in Action
1. Lazy-load each certificate on page load:

```html
<div hx-get="/item?name={{.Name}}" hx-trigger="load delay:200ms" hx-swap="outerHTML">
    <!-- Certificate content -->
</div>
```

2. Show certificate details in a modal when clicked:

```html
<div hx-get="/itemModal?name={{.Hostname}}" hx-trigger="click, keyup[key=='Enter']" hx-target="#modal" tabindex="0">
    <!-- Certificate summary -->
</div>
```

3. Close the modal when "OK" or "Escape" is triggered:

```html
<button type="button" hx-get="/empty" hx-trigger="click, keyup[key=='Escape'] from:body" hx-target="#modal">OK</button>
```

## Tailwind CSS CLI
To generate the CSS in the ./public folder, I use the following command:

```bash
tailwindcss -i ./frontend/styles.css -o ./public/styles.css --minify
```

## Wrapping Up
Svelte is still one of my favorite tools, especially for complex frontends. But for a tiny project like Sharp Cert Manager, it was overkill. The new setup using Go templates, HTMX, and Tailwind CLI is faster to build, easier to maintain, and requires no complex build tools. Sometimes simpler really is better.

Cheers,\
Lucas