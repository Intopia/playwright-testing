import { test, expect } from '@playwright/test';

// Where the playground page lives (inside your playwright-learning folder)
const pageUrl = 'file://' + process.cwd() + '/playground/buttons.html';

test('every button has an accessible name', async ({ page }) => {
  // Open the playground page
  await page.goto(pageUrl);

  // Find every button on the page
  const buttons = await page.getByRole('button').all();

  // Check each one has an accessible name (at least one character)
  for (const button of buttons) {
    // Grab the button's markup so a failure shows exactly which button it was
    const markup = await button.evaluate(el => el.outerHTML);

    // expect.soft keeps going after a failure, so every broken button is reported
    await expect.soft(
      button,
      'This button has no accessible name:\n' + markup
    ).toHaveAccessibleName(/.+/);
  }
});
