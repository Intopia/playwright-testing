import { expect } from '@playwright/test';

// ------------------------------------------------------------
// Reusable accessibility checks.
// Each one is written once, and can be run against any page
// that follows the same pattern.
// If a page has none of a component, its check simply passes.
// ------------------------------------------------------------


// DISCLOSURES (from example 2)
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


// KEYBOARD (from example 3)
// Every link, button and form control should be reachable with Tab.
export async function checkKeyboard(page, pageName) {
  const controls = await page
    .getByRole('link')
    .or(page.getByRole('button'))
    .or(page.getByRole('textbox'))
    .or(page.getByRole('checkbox'))
    .or(page.getByRole('combobox'))
    .all();

  // Press Tab through the page, marking whatever has focus each time
  for (let i = 0; i < controls.length * 2; i++) {
    await page.keyboard.press('Tab');
    await page.evaluate(() => document.activeElement.setAttribute('data-reached', ''));
  }

  // Check every control was marked
  for (const control of controls) {
    const markup = await control.evaluate(el => el.outerHTML);

    await expect.soft(
      control,
      pageName + ': could not reach this control with the Tab key:\n' + markup
    ).toHaveAttribute('data-reached', '');
  }
}


// DIALOGS (from example 4)
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


// FORMS (from example 5)
// After submitting a form empty, every field showing an error should
// have aria-invalid="true", and include the error in its accessible description.
export async function checkForms(page, pageName) {
  const forms = await page.locator('form').all();

  for (const form of forms) {
    const formName = pageName + ' > ' + (await form.getByRole('heading').textContent()).trim();

    // SUBMIT with every field left empty
    await form.getByRole('button').press('Enter');

    // Make sure error messages actually appeared
    const visibleErrors = form.locator('.error:visible');
    await expect.soft(visibleErrors, formName + ': submitting empty should show error messages').not.toHaveCount(0);

    for (const error of await visibleErrors.all()) {
      const errorText = (await error.textContent()).trim();

      // Each error's id is the field's id plus "-error"
      const fieldId = (await error.getAttribute('id')).replace('-error', '');
      const field = page.locator('#' + fieldId);
      const fieldLabel = (await page.locator('label[for="' + fieldId + '"]').textContent()).trim();
      const name = formName + ' > ' + fieldLabel;

      await expect.soft(field, name + ': should have aria-invalid="true"').toHaveAttribute('aria-invalid', 'true');
      await expect.soft(field, name + ': error message should be in its accessible description').toHaveAccessibleDescription(errorText);
    }
  }
}
