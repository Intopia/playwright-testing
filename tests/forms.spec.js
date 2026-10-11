import { test, expect } from '@playwright/test';

// The playground page
const pageUrl = 'https://intopia.github.io/playwright-testing/playground/forms.html';

test('every field with an error is marked invalid and linked to its message', async ({ page }) => {
  await page.goto(pageUrl);

  // Find every form on the page
  const forms = await page.locator('form').all();

  for (const form of forms) {
    // The form's heading, so failures say which form it was
    const formName = (await form.getByRole('heading').textContent()).trim();

    // SUBMIT: press Enter on the form's button, with every field left empty
    await form.getByRole('button').press('Enter');

    // Make sure error messages actually appeared.
    // (Without this, a form that showed no errors would quietly pass.)
    const visibleErrors = form.locator('.error:visible');
    await expect.soft(visibleErrors, formName + ': submitting empty should show error messages').not.toHaveCount(0);

    // Check every field that is now showing an error
    for (const error of await visibleErrors.all()) {
      const errorText = (await error.textContent()).trim();

      // Each error's id is the field's id plus "-error", so work back to the field
      const fieldId = (await error.getAttribute('id')).replace('-error', '');
      const field = page.locator('#' + fieldId);

      // The field's label, so failures say which field it was
      const fieldLabel = (await page.locator('label[for="' + fieldId + '"]').textContent()).trim();
      const name = formName + ' > ' + fieldLabel;

      // The field should be marked as invalid...
      await expect.soft(field, name + ': should have aria-invalid="true"').toHaveAttribute('aria-invalid', 'true');

      // ...and its error message should be part of its accessible description
      await expect.soft(field, name + ': error message should be in its accessible description').toHaveAccessibleDescription(errorText);
    }
  }
});
