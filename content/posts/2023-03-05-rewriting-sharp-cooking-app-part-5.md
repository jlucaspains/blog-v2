---
layout: post
title: "Rewriting SharpCooking - Part 5 - The fun with Playwright"
date: 2023-03-05
categories:
  - xamarin
  - iOS
  - android
  - series
  - SharpCooking
description: >-
  This is the fifth post on the rewriting SharpCooking series. Playwright is a fundamental part of the app and we will deep dive into it in this post.
cover:
    image: "/images/posts/testing.jpg"
    alt: "Testing"
    caption: "Testing"
---

This is the fifth and final post in the series. If you haven't read the previous posts, I recommend doing so for added context:

1. [The why and high level how]({{< ref "/posts/2023-01-01-rewriting-sharp-cooking-app-part-1" >}})
2. [The tech stack]({{< ref "/posts/2023-01-15-rewriting-sharp-cooking-app-part-2" >}})
3. [The unplanned API]({{< ref "/posts/2023-01-29-rewriting-sharp-cooking-app-part-3" >}})
4. [The DevOps]({{< ref "/posts/2023-02-19-rewriting-sharp-cooking-app-part-4" >}})

I omitted a lot of information about Sharp Cooking's testing in the previous posts in this series. I wanted to write a dedicated post about the experience, and this is it.

## Unit testing vs. end-to-end testing
I am somewhat biased when it comes to unit testing Single Page Applications (SPAs). I have had very little success in the projects I worked on before. As the codebase grows, the tests have become brittle, and the value has diminished. To be fair, I did put a token effort into unit testing Sharp Cooking, but I ended up discarding the few tests I had.

On the other hand, I have had great success with end-to-end (e2e) testing for SPAs. The key to e2e testing is to test interactions from a user perspective. For example, I expect users to create recipes manually as well as import them from a website, so my test steps should mimic what a user would do and validate the result in a similar manner.

Given my bias and the information above, I have decided to focus on e2e tests in the Sharp Cooking SPA app.

## Playwright
[Playwright](https://playwright.dev/) is a cross-platform, cross-browser, and cross-language testing framework from Microsoft. For Sharp Cooking, I used Playwright tests written in TypeScript and executed them in Chrome, Safari, and Firefox for desktop and Chrome and Safari for mobile. This configuration covers the most common devices I expect Sharp Cooking will be used on. Note that the mobile tests are executed in emulation mode and not on a real device.

I have used [Nightwatch.js](https://nightwatchjs.org/) and [Smart Bear Test Complete](https://smartbear.com/product/testcomplete/) to perform e2e tests before. Compared to them, I found Playwright's setup, including CI/CD, much easier, and the tooling much more complete.

## Create the first few tests
Using Playwright, you can either manually create tests or use the codegen utility. The codegen is a great way to get started quickly. If you have written e2e tests, you know that constructing `XPath` queries is not fun at all. The first thing you will notice is that the codegen doesn't actually suggest `XPath`. As you hover over components, the most common suggested way to identify them is via  `getByRole()` and `getByText()`.

To start the codegen tool:
```powershell
npx playwright codegen
```

Here is a short gif of how it works:
![Playwright recorder](/images/posts/playwright_recorder.gif)

Quite a few of the tests currently in the Sharp Cooking codebase were created via codegen. All they needed was a bit of code cleanup.

As the HTML tree becomes deep or large, it is a good idea to leverage test ids. They work as a marker for Playwright to find particular elements. After creating one, the codegen will favor getByTestId() over other approaches. The code below demonstrates the creation of a test id directly in HTML:

```html
<input type="text" data-testid="search-input" />
```

A real test would look like this:

```typescript
import { test, expect } from '@playwright/test';

test('a default recipe is created on first use', async ({ page }) => {
  await page.goto('/');
  const firstItem = await page.getByTestId('recipe-title');
  await expect(firstItem).toHaveText('Sourdough Bread');
});
```

## A bit of complication
Wouldn't it be great if all tests were simple like what we've seen this far? Wouldn't it be great...

Some user interactions require a bit more work than others. For instance, Sharp Cooking uses the [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) to open and save files. While I typically prefer not to mock anything, it is unavoidable in this situation.

To mock the browser-fs-access file picker, we need to use a `page.addInitScript()` that replaces `window.showOpenFilePicker` with a version that always returns a particular blob file handle. Note that the fileHandle is a shallow mock that returns a specific file, created off a blob with known JSON content. Maybe the actual code can explain it better:

```typescript
test('Restore json backup', async ({ page }) => {
    // Remember, the test script doesn't run within the browser the test is controlling
    // This is why we need to add a script to the page itself
    await page.addInitScript(() => {

        var blob = new Blob([`[
            {
                "id": 1,
                "title": "New Bread Recipe",
                "score": 5,
                "changedOn": "2022-12-29T00:35:42.073Z",
                "source": "Breadtopia",
                "ingredients": [
                    "142g whole wheat flour"
                ],
                "steps": [
                    "Mix together the dry ingredients"
                ],
                "notes": "May replace whole wheat flour with rye for added taste",
                "multiplier": 1,
                "image": "/bread.jpg",
                "imageAvailable": true,
                "images": []
            }
        ]`], { type: 'application/json' });
        var file = new File([blob], "file.json", { type: "application/json" });

        // browser-fs-access uses the getFile method of the file handle before
        // returning the file to the consumer. So we replace it too.
        const fileHandle = {
            getFile: async () => { return file; }
        };

        // Finally replace the showOpenFilePicker so that we can control the result
        (window as any).showOpenFilePicker = async (param: any) => {
            return [fileHandle];
        };
    });

    // The rest is just simple testing...
    await page.goto('#/recipe/import-backup');
    await page.getByTestId("import-button").click();
    await page.getByTestId("topbar-single-button").click();
    await page.goto('#/recipe/1');
    expect(await page.getByText('New Bread Recipe').textContent()).toEqual("New Bread Recipe");
});
```

## API calls
Sharp Cooking makes a few calls to its API. In particular, zip backups, image processing, and import from URL make API calls. However, the API endpoints are already tested separately, so I decided not to test them again. Instead, the tests use `page.route` to intercept and return results we can control for the tests:

```typescript
const response = "[]"; // whatever result is needed for the test
await page.route('**/api/parse-recipe', route => {
    const json = JSON.parse(response);
    route.fulfill({ json });
  });
```

## Oh Safari, why?
As usual, Safari doesn't play like the others. Some tests simply do not work in Safari. For instance, any test that mocks the API calls fails in Safari. I have spent way too much time trying to fix those but nothing works, so for now, they are skipped:

```typescript
test('import from url', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'this test doesnt work in webkit');
  // ...
});
```

Another challenge with testing in Safari is related to timeouts. Often, tests will fail because the default 30 seconds timeout will expire. There are 2 approaches to improving this:

1. Increase the timeout in each affected test: `test.setTimeout(60000);`
1. Allow for retries in the playwright.config.ts file: `retries: process.env.CI ? 2 : 0`

Technically, if a test fails once and passes next it is considered flaky. I recommend you put as much effort in fixing the actual root cause, but sometimes that is easier said than done so having a retry is not entirely a bad thing.

## Other notes
Another practice that may lead to flakiness is random input. As tempting as it is to have a generator create your field values, it can create issues as each execution will use different values. It is a bit too easy to get it wrong so I typically avoid it entirely.

E2e tests can take a while to run. As of writing, Sharp Cooking runs 162 total tests and takes between 5 and 10 minutes to execute. GitHub Actions have an agent timeout of 1 hour that needs to be considered. A similar timeout exists for Azure DevOps Pipelines as well.

## That's a close
As I mentioned before, this will be the last post in this series. I expect to write much more about Sharp Cooking in the future, but as far as describing the thought process in each decision I think I covered enough. If you have any specific question, please drop a comment here or in [Sharp Cooking's Git Hub](https://github.com/jlucaspains/sharp-cooking-web).

I had a lot of fun working on Sharp Cooking new app as well as writing these articles.

Cheers,

Lucas