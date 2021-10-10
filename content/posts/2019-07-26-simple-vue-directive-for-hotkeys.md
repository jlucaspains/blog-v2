---
layout: post
title: "Simple Vue directive for hotkeys"
date: 2019-7-26
comments: true
sharing: true
categories: [typescript, vue]
description: vue-mouseless is a tiny Vue directive for hotkey handling using mousetrap.
---

I'm a fan of hotkeys and I use them for a lot of things. In fact, I believe that 80% of the commands I use in my IDEs (Visual Studio and Visual Studio Code mostly) I use via hotkeys. Nothing is better than ``CTRL + p`` in VS Code or ``CTRL + k + d`` in VS. Anyway, while a lot of users really don't care about that, those that have data entry intensive use cases will probably appreciate some forethought in hotkeys in the apps they use.

For that matter, Vue already have a couple of good hotkey frameworks called [v-hotkey](https://github.com/Dafrok/v-hotkey) and [v-shortkey](https://github.com/iFgR/vue-shortkey). However, what they don't provide is a way to not just listen to key combinations but also key sequences (gmail style). To me, that's essential in web applications since the browser already handle keys like ``F3`` and ``CTRL+S``. For that matter, [mousetrap](https://github.com/ccampbell/mousetrap) is a very small javascript library to handle hotkeys. It is very simple, works quite well and provide both key combinations and sequences. In order to better integrate it into vue, I created a tiny library called vue-mouseless which consists of a single directive providing two features triggered by command keys: click simulation and focus.

Here is a simple vue component that demonstrates the directive:
<script src="https://gist.github.com/jlucaspains/aeb3cd3cfd3ecce3c496c9746e0cf1fc.js"></script>

As simple as this tool is, it has been enough for some of my project needs. PRs are welcome and I will share if anything new come up.

Finally (and maybe more importantly), code is on [github](https://github.com/jlucaspains/vue-mouseless/) and here is a [demo](https://f3zy8.codesandbox.io/).

Cheers,
Lucas