---
draft: true
layout: post
title: "Rewriting SharpCooking from Xamarin to PWA - Part 2"
date: 2023-01-08
categories:
  - xamarin
  - iOS
  - android
  - series
description: >-
  This is the second post on the rewriting SharpCooking series. In this post let's talk about frameworks and the tools utilized.
cover:
    image: "/images/posts/sharp-cooking-tools.png"
    alt: "Vue + Typescript = Sharp Cooking"
    caption: "Vue + Typescript = Sharp Cooking"
---

This is the second post on the series, if you haven't seen the first post yet, I recommend you read it for some more context.

1. [The why and high level how]({{< ref "/posts/2023-01-01-rewriting-sharp-cooking-app-part-1" >}})

This post is about the tools and frameworks I chose for Sharp Cooking Web.

## Frontend framework
I wanted the new Sharp Cooking to be as close to a real mobile app as possible. Once it is installed, it should be able to run completely offline. To achieve this independence, I decided to use a SPA framework instead of an SSR framework.

There are more than a few SPA frameworks out there. I'm sure that any of the big 3 (Angular, React, and Vue) would work just fine for this project. Also, I have extensive experience with Vue and some with both React and Angular so I feel comfortable with any of them. To be honest, I wanted to try Svelte. I felt like this was a perfect opportunity to build something real with it. However, when I started the project early last year SvelteKit was still in preview and not quite ready for me to use on Sharp Cooking. As much as I wanted to give it a real try, I had to fall back into something a bit more stable.

Now that we are back to the big 3, the choice was a matter of preference. I never truly enjoyed working with React and Angular has always felt like a bit too much work compared to the others. Thus, I went back to my old favorite, Vue.

Thus, Sharp Cooking is being rewritten with Vue 3 using Composition API "flavor" of development. Composition API is new to Vue 3 and it is much cleaner than Options API.

### Vite
Vite is fast, so fast that maybe it should have been named lightning. Having to deal with large projects in the past where the local DEV build could take upwards of 5 minutes, Vite is a very welcome change of pace. For a small project like SharpCooking, the local build and serve is done in milliseconds.

Vite requires a modern browser, which again, is not a problem for Sharp Cooking because PWAs are only supported in newer versions of the browsers anyway. it is possible to use plugins to enable using older browsers but I would say that is not needed whatsoever for this project. As of writing, Chrome, Edge, and Safari are the supported browsers though some effort will go into supporting Firefox.

### Package management
NPM or Yarn? I have used NPM more often, but nowadays I prefer yarn if given a choice. This is 100% based on simple preference though and I have no major arguments one way or another. 

### Javascript or Typescript
Typescript "removes" so many of the issues you typically see in a javascript code base that I would be hard-pressed to start a new project with pure javascript. Vue has provided support for typescript for a long time now, but Vue 3 with Composition API and Typescript hits the sweet spot by removing all the quirkiness you had to go through before.

### Router
Vue-router is great. The only slight complaint I have is registering the routes themselves. [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) is a good option to use convention-based routing. It uses the directory structure to determine the page's URL. Thus, page components go under `/pages` and the underlying structure makes the URL for the pages. Another nice feature of vite-plugin-pages is that it allows for parameters to be determined in a directory or page name. Given a directory `/pages/recipe/[id]` the id will be used as a parameter passed on to the page rendered. For URL `/recipe/1` the component `/pages/recipe/[id]/index.vue` will be loaded with a route param called id with value 1.

The route param value may be accessed in a Vue component like this:
```typescript
const id = computed(() => parseInt(route.params.id as string));
```

### State management
Initially, I installed vuex to control the application state. However, I quickly realized that there is so little data shared across components, that I removed it. The only state the app needs to share is the Top Bar title and menu options so that each page can show different information and options without having a dedicated top bar. Instead of a full state management package, I just used a bit of `inject`, `provide`, and reactiveness:

store.ts
```typescript
import { reactive, provide, inject, InjectionKey } from 'vue';

interface MenuOption {
    text?: string;
    svg?: string;
    action?: (() => void) | (() => Promise<void>);
    children?: MenuOption[];
}

interface State {
    title: string;
    menuOptions?: MenuOption[];
    hideTopBar?: boolean;
    fullScreen?: boolean;
  }

export const stateSymbol = Symbol('state') as InjectionKey<State>;
export const createState = () => reactive({ title: "", menuOptions: [] });

export const useState = () => inject(stateSymbol);
export const provideState = () => provide(
    stateSymbol,
    createState()
);
```

and then in main.ts
```typescript
import { createState, stateSymbol } from '@/store';

app.provide(stateSymbol, createState());
```

similarly in each component that needs the shared state:
```typescript
import { useState } from "@/store";

const state = useState()!;

// set title and menu options for the component
state.title = "A nice recipe";
state.menuOptions = [
    {
      text: "Options",
      children: [
        {
          text: "Delete",
          action: confirmDeleteItem,
        }
      ],
      svg: `<circle cx="12" cy="12" r="1" />  <circle cx="12" cy="5" r="1" />  <circle cx="12" cy="19" r="1" />`,
    },
  ];
```

## Styling
For styling, I was looking for something that was not a component framework. What I mean by that is that something like Bootstrap which has components "forces" you to work in a particular way. It also often requires additional javascript to be fully functional which again is the case for Bootstrap. 

[Tailwind CSS](https://tailwindcss.com/) is a utility-first framework. It is also geared towards a mobile-first experience which is the primary form factor Sharp Cooking users are expected to use. One thing to note about using Tailwind CSS is that components become fairly verbose with many classes. You will end up with dozens of classes in some components and that is fine, I guess.

## i18n
The Sharp Cooking mobile app is available in several languages and cultures so internationalization (i18n) and localization (l10n) are required for the new app. Thus, things like translation of the app interface and number formatting need to be provided in the first version. Additional features such as RTL support may be introduced in the future but since the original app does not have that support now, this will be considered in the future.

I chose [i18next-vue](https://i18next.github.io/i18next-vue/) for the new version of Sharp Cooking. Along with i18next-vue I will leverage [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) and [i18next-http-backend](https://github.com/i18next/i18next-http-backend) plugins. The former detects the language and culture from the browser to configure i18next-vue. The latter setups an HTTP-based backend where JSON files with the translation strings are loaded from simple web requests.

When it comes to number formatting, default javascript can do that so nothing too special is needed:

```typescript
const value = 1.5; // for demo purposes let's assume en-US here
const outLanguage = "pt-BR";

// output the number in the desired culture
const output = value.toLocaleString(outLanguage); // output should be 1,5
```

## Storing recipes offline
The original app uses an SQLite database which is not natively supported in web browsers. To allow for offline usage, the database needs to be available within the browser context as well. While there are Web Assembly versions of SQLLite, I would prefer something native to browsers with long-term storage when the app is installed. This can be achieved with [Indexed Db](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) which is supported in all major modern browsers.

One major caveat of using IndexedDb is that browser storage, in general, is subject to removal by the user or via eviction. [MDN provides guidelines](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria) on how much data can be stored, how it is maintained, and when it may be evicted. The short answer is that each browser handles limits differently:

* Chrome can store up to 60% of total disk space for a single origin.
* Safari seems to be capped at 1GB per origin, however, there is no official documentation to support this claim.
* Firefox can store up to 50% of available disk space for a domain and its subdomains.

This [web.dev](https://web.dev/storage-for-the-web/) article has comprehensive and updated information on the quotas above.

Sharp Cooking provides a few features to reduce the risks of using browser storage as the only storage mechanism. The following features were introduced to mitigate the data loss risks.

1. A user may download a backup file and save it to any long-term storage. When needed, the backup file can be stored and all recipe data and images are restored. 
2. [Issue #71](https://github.com/jlucaspains/sharp-cooking-web/issues/71) Images are optimized for storage before being saved so the space used is reduced significantly.
3. [Issue #72](https://github.com/jlucaspains/sharp-cooking-web/issues/72) The user can review the storage quota used by the install app on the Options page.

I found that using the IndexedDB API directly is fairly cumbersome and not intuitive. [Dexie](https://dexie.org/) is a wrapper around IndexedDB which makes the usage of IndexedDB almost trivial. Dexie is also [somewhat treeshakable](https://github.com/dexie/Dexie.js/issues/1584) so while the package is large, it will reduce in size on production builds.

## That's a wrap
This was a long post and I hope you got this far. Instead of just listing the tools of choice, I also wanted to provide some context for the decisions. I tried to be logical in the choices made, but in some situations, I chose purely on preference and I think that is fine as long as it doesn't deviate from the [core goals](https://github.com/jlucaspains/sharp-cooking-web) of Sharp Cooking as a product.

As always, feel free to check the progress, log issues, or contribute in the [GitHub repo](https://github.com/jlucaspains/sharp-cooking-web).

Next: Sharp Cooking API (Coming soon)