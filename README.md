# Playwright accessibility testing playground

Test pages and Playwright tests for the article [Accessibility testing with Playwright: what axe-core can't see](#).

The article shows what Playwright can check that axe-core can't: changing states, keyboard use, focus movement, form errors that only appear after submitting, and running the same checks across a whole site.

Each test page contains working components and at least one deliberately broken one. Run the matching test, and you should see it pass for the working components and fail for the broken one, for exactly the reason it should.

You can browse the pages online at the [playground site](https://intopia.github.io/playwright-testing/playground/).

## What's in this repo

```
playground/        The test pages
  site/            A small three-page website (example 6)
tests/             The Playwright tests, one per page
  helpers/         Reusable checks used in example 6
playwright.config.js
```

## The examples

| Example | Page | Test | What's deliberately broken |
| --- | --- | --- | --- |
| 1 | `buttons.html` | `buttons.spec.js` | An icon-only button with no accessible name |
| 2 | `disclosures.html` | `disclosures.spec.js` | A disclosure that never updates `aria-expanded` |
| 3 | `keyboard.html` | `keyboard.spec.js` | A `role="button"` control that can't be reached with Tab |
| 4 | `dialogs.html` | `dialogs.spec.js` | A dialog that drops focus when it closes |
| 5 | `forms.html` | `forms.spec.js` | One field never gets `aria-invalid="true"`, and another's error message isn't linked to the field |
| 6 | `site/` | `site.spec.js` | An "Add to cart" button on Products that can't be reached with Tab, and a field on Help that never gets `aria-invalid="true"` |

Example 1 is a baseline. axe-core already checks for missing button names, and does it well. Every example after that checks something axe-core can't, because it only happens after someone interacts with the page.

## Getting started

You'll need [Node.js](https://nodejs.org/) installed.

1. Clone or download this repo.
2. In a terminal, from the repo folder, install the dependencies:

   ```
   npm install
   ```

3. Install the browsers Playwright uses:

   ```
   npx playwright install
   ```

## Running the tests

There are two ways to run tests.

**UI mode** is best while you're exploring. You can run one test at a time and watch each step:

```
npx playwright test --ui
```

**The terminal** runs every test in Chromium, Firefox and WebKit, and writes an HTML report:

```
npx playwright test
```

To run a single test:

```
npx playwright test tests/disclosures.spec.js
```

To open the report from the last terminal run:

```
npx playwright show-report
```

## What to expect

**Every test should fail.** That's the point. Each one is designed to catch the deliberately broken components on its page, and only those components.

A few things worth knowing:

- **Keyboard tests are skipped in WebKit.** Playwright's WebKit follows Safari's default setting on macOS, where Tab skips links. The skip reason appears in the report. This applies to example 3, and to the keyboard tests in example 6.
- **The forms test reports two failures.** One for each broken field, and each field fails a different check.
- **The site test runs 36 tests.** That's three pages, four checks each, in three browsers. Most pass. The failures point to the two broken components.
- **Failing tests are slow.** Each failing check waits up to 5 seconds in case the page is still updating.

## Where the tests point

The test files run on your computer, but the pages they test are the published ones on the [playground site](https://intopia.github.io/playwright-testing/playground/). Each test sets its page near the top, like this:

```javascript
const pageUrl = 'https://intopia.github.io/playwright-testing/playground/disclosures.html';
```

That means you'll need an internet connection to run them. It also means the tests here match the code in the article exactly.

## Breaking and fixing things

You can't edit the published pages, but you can edit your local copies in the `playground` folder and point a test at those instead. Swap the `pageUrl` line for this one (changing the file name to suit):

```javascript
const pageUrl = 'file://' + process.cwd() + '/playground/disclosures.html';
```

`process.cwd()` means "the folder you ran the test from", so run the test from the repo folder.

To see a test pass, fix the broken component in your local copy, then run the test again. Each page has a "Deliberately broken" section or a playground note explaining what's wrong.

It's also worth trying the reverse: break a working component, and check the test catches it. That's how you know a test is really checking what you think it is.

For example 6, the page addresses are in the `sitePages` list in `site.spec.js`. Change each `url` to a local path in the same way, such as `'file://' + process.cwd() + '/playground/site/index.html'`.

## Please note

- **The broken components are deliberate.** Please don't copy them.
- **The code is kept simple on purpose.** It's written to be easy to follow, not as a model for structuring a real test suite. See the [Playwright documentation](https://playwright.dev/docs/intro) for that.
- **A passing test proves only what it checks.** It doesn't replace manual testing, or testing with assistive technology.
