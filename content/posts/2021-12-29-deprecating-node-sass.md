---
layout: post
title: "Removing node-sass from VueJS project"
date: 2021-12-29
categories:
  - vue
description: >-
  I've dreaded the npm install command for a while now and most of my grief was caused by node-sass. I finally took the time to remove it in favor of dart-sass and I couldn't be happier. Let's talk about why and how in this post.
cover:
    image: "/images/posts/node-sass_error.png"
    alt: "Node Sass error"
    caption: "The dreaded errors from node-sass installation"
---

Let's start with some context so things make sense. I've created a vue project back in 2018. It is the largest project I work on regularly and we've done a decent job to keep everything up to date in it. This project is built by Azure DevOps hosted servers and recently the builds started failing because of node-sass. Let's talk about the problem, and how we can fix it.

First, you should know that [node-sass](https://github.com/sass/node-sass) is no longer recommended. The project owners now recommend [Dart Sass](https://sass-lang.com/dart-sass) instead.

Now, why were my builds failing? The problem is that node-sass and its dependencies require a crazy amount of things to be perfectly in place so that the build works. For instance, you need python and components from visual studio. [Here is one example](https://stackoverflow.com/questions/45801457/node-js-python-not-found-exception-due-to-node-sass-and-node-gyp
) of someone having issues similar to mine. None of these solutions worked for me because I have nearly no control of the Azure DevOps hosted build servers. Everything worked ok until MS stopped installing VS 2017 in the build servers and I can't just ask them to put it back on.

Honestly, I spent too many hours trying to fix this. Updated the packages? Check. Tried different versions of Azure DevOps hosted agents? Check. Cried all over my keyboard? Check. In the end, I had no choice but to remove node-sass from my project entirely.

I was surprised that replacing node-sass with sass package was so simple. I found [this documentation page](https://panjiachen.github.io/vue-element-admin-site/guide/advanced/sass.html) in vue-element-admin that helped greatly.

Long story short:

1. Uninstall node-sass and install sass packages (dart sass)

```cmd
npm uninstall node-sass
npm install sass -D
```

2. Replace all instances of ``/deep/`` with ``::v-deep``

Before:
```scss
/deep/ .actions-column {
  width: 1rem;
}
```

After:
```scss
::v-deep .actions-column {
  width: 1rem;
}
```

3. Adjust your existing code for any other warnings.

![Bootstrap warnings](/images/posts/dart-sass-warnings.png)

In the example above, bootstrap is doing divisions outside of calc() which will be deprecated soon. This one is simple, when bootstrap is "fixed" and I update the dependency, the warning will go away.

The primary lesson learned here is that I should have replaced this component earlier instead of fighting it for so long. The second lesson is: if your library has so many dependencies which makes it hard to consume, try and make it simpler.

Cheers,

Lucas