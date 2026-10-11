import { expect } from '@playwright/test';

// ------------------------------------------------------------
// Reusable accessibility checks.
// Each one is written once, and can be run against any page
// that follows the same pattern.
// ------------------------------------------------------------


// DISCLOSURES (from example 1)
// Every disclosure button should keep aria-expanded in sync
// with whether its content is visible.
export async function checkDisclosures(page, pageName) {
  const buttons = await page.locator('button[aria-controls]').all();

  for (const button of buttons) {
    const name = pageName + ' > ' + (await button.textContent()).trim();
    const panelId = await button.getAttribute('aria-controls');
    const panel = page.locator('#' + panelId);

    // OPEN
    await button.press('Enter');
    await expect.soft(panel, name + ': content should be visible when opened').toBeVisible();
    await expect.soft(button, name + ': aria-expanded should be "true" when opened').toHaveAttribute('aria-expanded', 'true');

    // CLOSE
    await button.press('Enter');
    await expect.soft(panel, name + ': content should be hidden when closed').toBeHidden();
    await expect.soft(button, name + ': aria-expanded should be "false" when closed').toHaveAttribute('aria-expanded', 'false');
  }
}


// DIALOGS (from example 3)
// Every dialog should focus its heading when it opens,
// and return focus to its trigger button when closed with Escape.
export async function checkDialogs(page, pageName) {
  const triggers = await page.locator('button[aria-haspopup="dialog"]').all();

  for (const trigger of triggers) {
    const name = pageName + ' > ' + (await trigger.textContent()).trim();

    // OPEN
    await trigger.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect.soft(dialog, name + ': dialog should be open').toBeVisible();
    await expect.soft(dialog.getByRole('heading'), name + ': focus should move to the dialog heading').toBeFocused();

    // CLOSE
    await page.keyboard.press('Escape');
    await expect.soft(dialog, name + ': dialog should close with Escape').toBeHidden();

    // Find out where focus actually is, so a failure can say where it went
    const focusedOn = await page.evaluate(() => document.activeElement.tagName.toLowerCase());

    await expect.soft(
      trigger,
      name + ': focus should return to the button that opened the dialog (focus is currently on: <' + focusedOn + '>)'
    ).toBeFocused();
  }
}
