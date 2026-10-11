# Playwright accessibility testing playground

Test pages and Playwright tests for the article [Accessibility testing with Playwright: what axe-core can't see](#).

The article shows what Playwright can check that axe-core can't: changing states, keyboard use, focus movement, related states staying in sync, and running the same checks across a whole site.

Each test page contains working components and at least one deliberately broken one. Run the matching test, and you should see it pass for the working components and fail for the broken one, for exactly the reason it should.

You can browse the pages online at the [playground site](https://intopia.github.io/playwright-testing/playground/).

## What's in this repo

```
playground/        The test pages
  site/            A small three-page website (example 5)
tests/             The Playwright tests, one per page
  helpers/         Reusable checks used in example 5
playwright.config.js
```

## The examples

| Example | Page | Test | What's deliberately broken |
| --- | --- | --- | --- |
| Warm-up | `buttons.html` | `buttons.spec.js` | An icon-only button with no accessible name |
| 1 | `disclosures.html` | `disclosures.spec.js` | A disclosure that never updates `aria-expanded` |
| 2 | `keyboard.html` | `keyboard.spec.js` | A `role="button"` control that can't be reached with Tab |
| 3 | `dialogs.html` | `dialogs.spec.js` | A dialog that drops focus when it closes |
| 4 | `tabs.html` | `tabs.spec.js` | A tab set that ignores the arrow keys |
| 5 | `site/` | `site.spec.js` | A broken disclosure on Products, a broken dialog on Help |

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

**Every test should fail.** That's the point. Each one is designed to catch the deliberately broken component on its page, and only that component.

A few things worth knowing:

- **The keyboard test is skipped in WebKit.** Playwright's WebKit follows Safari's default setting on macOS, where Tab skips links. The skip reason appears in the report.
- **The tabs test reports six failures.** There's only one bug, but it causes several checks to fail.
- **Failing tests are slow.** Each failing check waits up to 5 seconds in case the page is still updating.

To see a test pass, fix the broken component in its page, then run the test again.

## Please note

- **The broken components are deliberate.** Please don't copy them.
- **The code is kept simple on purpose.** It's written to be easy to follow, not as a model for structuring a real test suite. See the [Playwright documentation](https://playwright.dev/docs/intro) for that.
- **A passing test proves only what it checks.** It doesn't replace manual testing, or testing with assistive technology.
