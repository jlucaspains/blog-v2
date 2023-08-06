---
layout: post
title: "Introducing sharp-recipe-parser"
date: 2023-08-05
categories:
  - announcement
  - typescript
description: >- 
  Introducing sharp-recipe-parser npm package. It is a new and small typescript package to extract information from recipe ingredient and instruction lines.
cover:
    image: "/images/posts/recipe-uom.jpg"
    alt: "Recipe UOMs"
    caption: "Photo by [Kara Eads](https://unsplash.com/@karaeads?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/AemWnTSPxoE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  "
---

For almost four years now, I have maintained the [Sharp Cooking app](<https://sharpcooking.lpains.net>). From the beginning, one of the features I wanted to provide was ingredient UOM conversion. In version 1.4 of the app, a preview of the UOM conversion feature was made available. In this post, I will describe the process and how it was achieved.

Before we get into UOM conversion, we first need to break down an ingredient line into its components. Recipe ingredient lines primarily consist of the quantity, the UOM, the ingredient, and any additional instructions. It should look like this:

![Ingredient Parts](/images/posts/ingredientParts.png)

There are several options in JavaScript that are capable of breaking down an ingredient line into its components. While exploring the possibilities, I reviewed the following options:

1. [recipe-ingredient-parser-v3](<https://www.npmjs.com/package/recipe-ingredient-parser-v3>) - regex based
2. [zestfuldata](<https://zestfuldata.com/>) - not free
3. [NY Times ingredient-phrase-tagger](<https://github.com/nytimes/ingredient-phrase-tagger>) - no longer maintained and not very precise

After implementing the functionality using each of the options above, none of them were in a state that did all I needed. In short, they were either not very maintainable, not free, not precise enough, or would take too much time to adjust for my needs. Thus, [sharp-recipe-parser](<https://github.com/jlucaspains/sharp-recipe-parser>) was born. The code base is in TypeScript and it is actually simple. Instead of regular expressions, it relies on language-based conventions that the package implements as rules.

> sharp-recipe-parser is a convention-based recipe ingredient and instruction parser.

This is how ingredient parsing works from a high-level perspective:

1. Tokenize the ingredient line.
2. From the first token to the last, look for quantity. It must be a number, a regular or unicode fraction like 1/2 or ½, a composite number with fraction, or a range split by a language-specific marker (- or to in American English).
3. Excluding tokens consumed previously, look up the next token against the valid language-based UOM dictionary.
4. Excluding tokens consumed previously, take remaining tokens up to a comma as the ingredient.
5. Take remaining tokens as extra.

Since most cooking UOM conversions are relatively simple (e.g., 1 cup = 16 tablespoons), the package will also return common cooking conversions: cup, tbsp, tsp, pound, gram, liter, etc. Note that converting across different UOM dimensions is not currently possible. So converting 1 cup of flour to grams will not work. Yet.

Besides parsing ingredient lines, sharp-recipe-parser can also parse instruction lines. It extracts timing and temperature information from the instruction. For a line such as "bake at 350F for 30 min," it will return 350 for temperature, Fahrenheit for temperature UOM, and 1800 seconds for time.

[sharp-recipe-parser](<https://www.npmjs.com/package/@jlucaspains/sharp-recipe-parser>) is available as an npm package and is only [7Kb when gzipped](<https://bundlephobia.com/package/@jlucaspains/sharp-recipe-parser@1.0.0-beta10>). Get started right away by installing the package from npm:

```powershell
npm install @jlucaspains/sharp-recipe-parser
# or
yarn add @jlucaspains/sharp-recipe-parser
```

Or check out the live demo at [sharp-recipe-parser.lpains.net](https://sharp-recipe-parser.lpains.net/).

If you'd like to contribute, please create issues and/or pull requests directly in the repo. I'm currently working on the project very actively, so there is a good chance I will provide feedback quickly.

That's all for today. Cheers,

Lucas