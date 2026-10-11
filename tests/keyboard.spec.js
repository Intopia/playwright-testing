import { test, expect } from '@playwright/test';

// The playground page
const pageUrl = 'https://intopia.github.io/playwright-testing/playground/keyboard.html';

test('every interactive control can be reached with the Tab key', async ({ page, browserName }) => {
  // WebKit follows Safari's default setting on macOS, where Tab skips links.
  // That would make this test fail for reasons unrelated to the page, so skip it there.
  test.skip(browserName === 'webkit', 'WebKit skips links with Tab by default');

  await page.goto(pageUrl);

  // The controls we expect keyboard users to reach:
  // anything exposed as a link, button, text field, checkbox or select
  const controls = await page
    .getByRole('link')
    .or(page.getByRole('button'))
    .or(page.getByRole('textbox'))
    .or(page.getByRole('checkbox'))
    .or(page.getByRole('combobox'))
    .all();

  // Press Tab through the page. Each time, mark whatever has focus.
  // (We press Tab twice as many times as there are controls, to be safe.)
  for (let i = 0; i < controls.length * 2; i++) {
    await page.keyboard.press('Tab');
    await page.evaluate(() => document.activeElement.setAttribute('data-reached', ''));
  }

  // Check every control was marked
  for (const control of controls) {
    const markup = await control.evaluate(el => el.outerHTML);

    await expect.soft(
      control,
      'Could not reach this control with the Tab key:\n' + markup
    ).toHaveAttribute('data-reached', '');
  }
});
