---
layout: post
title: "GO REST Template Major Changes"
date: 2024-07-05
categories:
  - announcement
description: >-
    I recently updated jlucaspains/go-rest-template with key improvements based on Reddit feedback! Changes include switching to SQLC, Go's built-in router, and more.
cover:
    image: "/images/posts/golang.png"
    alt: "GO REST Template Major Changes"
    caption: "GO REST Template Major Changes"
---

I've been working on side projects with the Go language for a while, and it has quickly become my favorite tool for getting things done. About a year ago, I created a template repository on GitHub to help me (and hopefully you) bootstrap new projects. This template has evolved over time, and I've recently decided to make some major changes to it.

Before diving into the changes, here's some context. The Go community is quite active on Reddit. When I first created the template repository, I shared it in [a Reddit post](https://www.reddit.com/r/golang/comments/1367oro/golang_restapi_boilerplate_repository/). I received valuable feedback, which I've been considering for a while.

## 1. Replacing GORM with SQLC and Migrate

This was the most common recommendation. Many people pointed out that GORM was buggy and not idiomatic. This feedback encouraged me to try other options like [SQLC](https://sqlc.dev/), which I quickly liked. Since I was using GORM for migrations too, and SQLC doesn't offer that out of the box, I introduced [migrate](https://github.com/golang-migrate/migrate). To be honest, I'm not entirely satisfied with migrate. It is a fine tool when it works, but when errors occur, they are fairly cryptic. I might replace it again in the future, but it's okay for now.

## 2. Switching from Gin to Go's Built-in Router

I didn't realize Gin was so controversial. I used it for a while and found it decent. However, the feedback made me explore other options. Initially, I switched to Gorilla MUX because its routing capabilities were better than Go's built-in router. However, with Go 1.22, the built-in router has become a great option, and I've fully committed to using it.

## 3. Removing the SQLite Provider

I realized that my initial template was too close to being a framework, which was never the goal. So, I removed the SQLite provider along with the provider option altogether. PostgreSQL is a great choice for a production-ready application, and if there's a need for a different provider, it should now be easy to implement with SQLC.

## 4. Other Smaller Changes

1. Use [log/slog](https://pkg.go.dev/log/slog) for logging.
2. Add more unit tests.
3. Switch to [github.com/rs/cors](https://github.com/rs/cors) instead of [gorilla/handlers](https://github.com/gorilla/handlers).

Cheers,\
Lucas