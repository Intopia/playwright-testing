// @ts-check

// test 1
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});


// test 2
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Playwright website has a main heading', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(
    page.getByRole('heading', { level: 1 })
  ).toBeVisible();
});

// test 3
test('Link receives focus', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Get started' }).focus();

  await expect(
    page.getByRole('link', { name: 'Get started' })
  ).toBeFocused();
});

// test 4
test('Link receives tab', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
  }

  await expect(
    page.getByRole('link', { name: 'Get started' })
  ).toBeFocused();
});

// test 5
test('Link moves to new page', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
  }

  await expect(
    page.getByRole('link', { name: 'Get started' })
  ).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('https://playwright.dev/docs/intro');
});

// test 6
test('Link moves to heading on new page', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
  }

  console.log(
    'Focused element:',
    await page.evaluate(() => document.activeElement?.outerHTML)
  );

  await expect(
    page.getByRole('link', { name: 'Get started' })
  ).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('https://playwright.dev/docs/intro');

  await expect(
    page.getByRole('heading', { name: 'Installation', level: 1 })
  ).toBeVisible();
});

// test 7
test('Link moves to first focus', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
  }

  await expect(
    page.getByRole('link', { name: 'Get started' })
  ).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('https://playwright.dev/docs/intro');

  console.log(
    'Focused element before Tab:',
    await page.evaluate(() => document.activeElement?.outerHTML)
  );

console.log(
  'Before Tab:',
  await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    text: document.activeElement?.getAttribute('aria-label')
      || document.activeElement?.textContent?.trim().slice(0, 50),
    connected: document.activeElement?.isConnected
  }))
);

  await page.keyboard.press('Tab');

  console.log(
    'Focused element after Tab:',
    await page.evaluate(() => document.activeElement?.outerHTML)
  );

  await expect(
    page.getByRole('link', { name: 'Star microsoft/playwright on GitHub' })
  ).toBeFocused();

});

