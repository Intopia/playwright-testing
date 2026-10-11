import { test } from '@playwright/test';
import { checkDisclosures, checkDialogs } from './helpers/accessibility-checks.js';

// Every page on the site we want to check.
// To cover a new page, just add it to this list.
const sitePages = [
  { name: 'Home', file: 'home.html' },
  { name: 'Products', file: 'products.html' },
  { name: 'Help', file: 'help.html' },
];

// Create one test for each page in the list
for (const sitePage of sitePages) {
  test(sitePage.name + ' page: disclosures and dialogs behave correctly', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/playground/site/' + sitePage.file);

    // Run every reusable check against this page
    await checkDisclosures(page, sitePage.name);
    await checkDialogs(page, sitePage.name);
  });
}
