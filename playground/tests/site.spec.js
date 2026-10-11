import { test } from '@playwright/test';
import { checkDisclosures, checkKeyboard, checkDialogs, checkForms } from './helpers/accessibility-checks.js';

// Every page on the site we want to check.
// To cover a new page, just add it to this list.
const sitePages = [
  { name: 'Home', file: 'index.html' },
  { name: 'Products', file: 'products.html' },
  { name: 'Help', file: 'help.html' },
];

// For each page, create a group of tests: one for each reusable check
for (const sitePage of sitePages) {
  test.describe(sitePage.name + ' page', () => {

    // Before each test in this group, open the page
    test.beforeEach(async ({ page }) => {
      await page.goto('file://' + process.cwd() + '/playground/site/' + sitePage.file);
    });

    test('disclosures keep aria-expanded in sync', async ({ page }) => {
      await checkDisclosures(page, sitePage.name);
    });

    test('every control can be reached with the keyboard', async ({ page, browserName }) => {
      // WebKit skips links with Tab by default (see example 3)
      test.skip(browserName === 'webkit', 'WebKit skips links with Tab by default');
      await checkKeyboard(page, sitePage.name);
    });

    test('dialogs manage focus', async ({ page }) => {
      await checkDialogs(page, sitePage.name);
    });

    test('form errors are marked invalid and linked', async ({ page }) => {
      await checkForms(page, sitePage.name);
    });

  });
}
