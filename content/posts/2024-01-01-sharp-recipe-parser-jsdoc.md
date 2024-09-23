---
layout: post
title: "Converting sharp-recipe-parser from typescript to javascript + jsdoc"
date: 2024-01-01
categories:
  - typescript
  - javascript
  - SharpCooking
description: >-
    Exploring the conversion of a TypeScript project to JavaScript with JSDoc. Unveiling challenges in tooling, module adjustments, and insights on TypeScript's relevance in library development
cover:
    image: "/images/posts/javascript-code.jpg"
    alt: "JavaScript code"
    caption: "JavaScript code"
    caption: "Photo by [Pankaj Patel](https://unsplash.com/@pankajpatel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/person-sitting-in-front-of-computer-1IW4HQuauSU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
---

## Introduction
I should start by saying that I am a big proponent of TypeScript. I have been using it since version 1.5 back in 2015. Coming from a backend background with typed languages, not having types in JavaScript was an interesting experience for me. As a developer, the two aspects of typed languages that help me the most are intellisense and the compiler. Intellisense helps me write code faster, and the compiler helps me catch errors before runtime.

While JavaScript itself doesn't have a type system, the tooling around it has significantly improved over the years. For example, VS Code has an excellent IntelliSense engine that can infer types from the code. Additionally, you can enhance the development experience even further by leveraging TypeScript's type system, without actually writing TypeScript code. With this in mind, I decided to try converting one of my TypeScript projects to pure JavaScript using JSDoc. For this exercise, I chose sharp-recipe-parser because it is a small npm package library that doesn't explicitly require a build system.

In the next sections, we will take a somewhat detailed look at the process, challenges, and the more interesting aspects of the conversion. Note that this is not necessarily a conversion guide, but rather how I approached it in this instance.

## TLDR;
Here is the commit that includes 99% of the changes: [commit link](https://github.com/jlucaspains/sharp-recipe-parser/commit/2b980cb789828d8dc73bd212d1702f16d7990e63).

## 1. Change .ts to .js
Easy enough. Just change all `.ts` files to `.js`. Obviously, you will get a ton of errors on any type notations you have in the code. We will fix that next.

## 2. Convert type annotations to JSDoc
Funny enough, we are converting TypeScript code to JavaScript, but not removing TypeScript from the project. We can still use it to do some type checking and to enhance the coding experience. So, we add the `//@ts-check` notation to the top of each `.js` file. This will greatly enhance your experience in IDEs that support this flag, such as VS Code. You can read more about it [here](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#checking-types).

Next, replace TypeScript-specific notations with JSDoc. For example, replace `: string` with `@type {string}`. You can find a list of the notations [here](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).

Some types are used in different modules. For this reason, I created a `types.js` module that only hosts a few common types in JSDoc format. This file is then imported in the other files as needed.

Partial `types.js` file:
```javascript
/**
 * @typedef {{
 *  symbol: string;
 *  text: string;
 *  customFunction?: (tokens: string[], startIndex: number) => { uom: string; uomText: string; newIndex: number };
 *  conversionGroup?: string;
 * }} UnitDetail
 */

export const Types = {};
```

When consuming:
```javascript
import * as Types from "./types.js";

/**
 * @type {Map<string, Types.UnitDetail>}
 */
const ingredientUnits = new Map();
```

## 3. JavaScript modules
In TypeScript, I nearly always do a module import without the extension. During transpilation, TypeScript will adjust the import as needed. However, browser environments will require the full file name. For example, `import { tokenize } from "./tokenizer";` will need to be changed to `import { tokenize } from "./tokenizer.js";`.

Additionally, to keep using import instead of require, change the `package.json` file to use the `type = module` flag. This will, however, create a few other issues in tooling to be explored in the next section.

## 4. Tooling changes
At this point, the code itself should work. But there are problems with unit tests and linting. We will need to make some changes to our tooling to get it to work. We'll start by removing some npm packages that are no longer needed:

```bash
yarn remove ts-node @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-standard-with-typescript ts-jest
```

### 4.1. Jest
Jest currently provides experimental support for ESM modules. However, I found that using Babel was an easier experience. You can find a good guide on how to do that [here](https://jestjs.io/docs/getting-started#using-babel). In summary:

1. Uninstall some packages:
```bash
yarn remove ts-node @types/jest ts-jest
```
2. Install babel:
```bash
yarn add --dev babel-jest @babel/core @babel/preset-env
```
3. Create `babel.config.cjs`:
> Note that `.cjs` is used because the Babel config uses CommonJS syntax.
```javascript
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```
4. Rename the config file to `jest.config.cjs` and adjust the coverage path:
> Note that `.cjs` is used because the Jest config uses CommonJS syntax.
```javascript
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.js"
  ]
}; 
```

### 4.2. Eslint
Make the following changes to the `.eslintrc.js` file:

1. Remove TypeScript-specific plugins and replace with `eslint:recommended`.
```bash
yarn remove @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-standard-with-typescript
```
2. Change parser options to use the latest ECMAScript version and source type module. Also change env to use browser, node, ES6, and Jest.

```diff
  module.exports = {
    extends: [
      "eslint:recommended",
-     "plugin:@typescript-eslint/recommended",
-     "plugin:@typescript-eslint/recommended-requiring-type-checking",
-     "plugin:@typescript-eslint/strict",
+     "plugin:jsdoc/recommended",
      "prettier",
    ],
-   plugins: ["@typescript-eslint", "prettier"],
-   parser: "@typescript-eslint/parser",
+   plugins: ["jsdoc", "prettier"],
    parserOptions: {
-     project: "./tsconfig.lint.json",
+     ecmaVersion: "latest",
+     sourceType: "module"
+   },
+   env: {
+     browser: true,
+     node: true,
+     es6: true,
+     jest: true
    },
    root: true,
    rules: {
      "prettier/prettier": ["error"],
-     "@typescript-eslint/no-unnecessary-condition": [
-       "error",
-       { allowConstantLoopConditions: true },
-     ],
    },
  };
```

3. Add a new plugin to help with JSDoc integration.
```bash
yarn add eslint-plugin-jsdoc --dev
```

## 5. Generating TypeScript types
At this point, sharp-recipe-parser was converted. However, any TypeScript-based clients, like Sharp Cooking, would not have the necessary types for compilation. We can generate them using the `tsc` command. This will leverage the new JSDoc to generate a `.d.ts` file for each `.js` file in the `src` directory.

```bash
tsc --declaration --allowJs --emitDeclarationOnly
```

At this point, we can run this once after every change or change the GitHub workflow to run this command before packaging and pushing to [npmjs.com](https://npmjs.com/). Since it is very likely I will forget to run this command, I opted for the latter.

Add the command to package.json:
```diff
...
  "scripts": {
    "run": "node src/index.js",
    "test": "jest",
    "coverage": "jest --coverage",
    "lint": "eslint --ignore-path .eslintignore --ext .js .",
    "lintfix": "eslint --fix --ignore-path .eslintignore --ext .js .",
+   "types": "tsc --declaration --allowJs --emitDeclarationOnly"
  },
...
```

Add the command to the GitHub workflow:
```diff
...
       - run: yarn install 
-      - run: yarn build
+      - run: yarn run types
...
```

## Conclusion
I honestly thought the process would be easier than it actually was. Converting the code and creating the JSDoc entries wasn't bad. But making modules, ESLint, and Jest work was a bit more challenging. I do expect that creating a new project from scratch would be easier than going through the conversion process.

While I do like the simplicity of JavaScript instead of TypeScript for libraries, so far the benefit has been fairly small. I expect to have a better perspective as I make changes to sharp-recipe-parser. For other projects, I will definitely stick to my old faithful TypeScript for apps and evaluate on a case-by-case basis for libraries.