import { test, expect } from '@playwright/test';

// The playground page
const pageUrl = 'https://intopia.github.io/playwright-testing/playground/disclosures.html';

test('every disclosure keeps aria-expanded in sync with its content', async ({ page }) => {
  await page.goto(pageUrl);

  // Find every disclosure button: any button that controls another element
  const buttons = await page.locator('button[aria-controls]').all();

  for (const button of buttons) {
    // The button's visible text, so failures say which disclosure it was
    const name = (await button.textContent()).trim();

    // Find the content this button controls, using its aria-controls value
    const panelId = await button.getAttribute('aria-controls');
    const panel = page.locator('#' + panelId);

    // OPEN: press Enter on the button
    await button.press('Enter');
    await expect.soft(panel, name + ': content should be visible when opened').toBeVisible();
    await expect.soft(button, name + ': aria-expanded should be "true" when opened').toHaveAttribute('aria-expanded', 'true');

    // CLOSE: press Enter again
    await button.press('Enter');
    await expect.soft(panel, name + ': content should be hidden when closed').toBeHidden();
    await expect.soft(button, name + ': aria-expanded should be "false" when closed').toHaveAttribute('aria-expanded', 'false');
  }
});
