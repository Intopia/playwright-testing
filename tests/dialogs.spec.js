import { test, expect } from '@playwright/test';

// The playground page
const pageUrl = 'https://intopia.github.io/playwright-testing/playground/dialogs.html';

test('every dialog focuses its heading on open and returns focus on Escape', async ({ page }) => {
  await page.goto(pageUrl);

  // Find every button that opens a dialog
  const triggers = await page.locator('button[aria-haspopup="dialog"]').all();

  for (const trigger of triggers) {
    const name = (await trigger.textContent()).trim();

    // OPEN: press Enter on the trigger button
    await trigger.press('Enter');

    // Find the open dialog (closed dialogs are ignored by getByRole)
    const dialog = page.getByRole('dialog');
    await expect.soft(dialog, name + ': dialog should be open').toBeVisible();

    // Focus should be on the dialog's heading
    await expect.soft(
      dialog.getByRole('heading'),
      name + ': focus should move to the dialog heading'
    ).toBeFocused();

    // CLOSE: press Escape
    await page.keyboard.press('Escape');
    await expect.soft(dialog, name + ': dialog should close with Escape').toBeHidden();

    // Focus should return to the button that opened the dialog
    await expect.soft(
      trigger,
      name + ': focus should return to the button that opened the dialog'
    ).toBeFocused();
  }
});
