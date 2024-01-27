---
layout: post
title: "How to benchmark javascript coding options"
date: 2024-01-27
categories:
  - util
description: >-
    Benchmarking is a useful process for comparing different implementations of the same functionality to determine efficiency. This post explores benchmarking JavaScript code using online tools.
cover:
    image: "/images/posts/benchmark.png"
    alt: "Stopwatch"
    caption: "Benchmarking"
---

There are multiple ways to accomplish the same task in any programming language. Sometimes, it can be challenging to determine the most efficient approach, especially when you've performed the task countless times. This is where benchmarking comes in handy. Benchmarking involves comparing different implementations of the same functionality to determine the most efficient one. In this post, I will demonstrate how to benchmark JavaScript code using several popular online tools.

## The Problem
Recently, I implemented an advanced recipe search feature in the [Sharp Cooking app](<https://sharpcooking.net>). Initially, I considered using the [Fuse.js](<https://fusejs.io/>) library, as it would allow me to search for recipes using fuzzy matching across various parts of the recipe. However, I decided to start with a simpler approach and expand the existing text search to include recipe ingredients and instructions, in addition to the title. I was unsure whether to use a regular expression or the simple `field.includes()` method. To make an informed decision, I decided to benchmark a few options.

## Implementation Options
1. `field.includes(lookup)`
2. `regex.test(field)`
3. `field.search(lookup)`
4. `field.indexOf(lookup)`

## Benchmark tools
There are several benchmarking tools available for JavaScript. For this exercise, I used the following tools:

1. [jsbenchmark.com](https://jsbenchmark.com/)
![jsbenchmark.com string search](/images/posts/string-search-jsbenchmark.png)

2. [jsbench.me](https://jsbench.me/)
![jsbenchmark.com string search](/images/posts/string-search-jsbench-me.png)

3. [jsperf.app](https://jsperf.app/)
![jsbenchmark.com string search](/images/posts/string-search-jsperf-app.png)

Overall, these tools function similarly. You set up the test by creating variables, create four test cases (one for each option), and then run the tests. The tool will execute each test case multiple times and provide the results.

## Results
The results of the benchmarking tests were quite interesting. In all three tools, `field.includes(lookup)` was the fastest, while `field.search(lookup)` was the slowest.

Keep in mind that each tool operates differently, and results may vary. In my case, the results were consistent across the tools, but that may not always be the case. Additionally, be cautious of the ops/s (operations per second) metric. It provides a good indication of the performance difference between options, but the actual tool implementation and the environment in which it runs (e.g., browser or Node.js) can influence the results. If you require results that closely align with your specific implementation, it is advisable to run benchmark tests in your own environment.

## Conclusion
Despite some pitfalls, benchmarking is an excellent method for comparing different implementations of the same functionality. Online tools can be helpful if they suit your needs, or you can run benchmarks in your own environment for more accurate results.

Cheers,\
Lucas