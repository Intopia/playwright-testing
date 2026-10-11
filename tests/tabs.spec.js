import { test, expect } from '@playwright/test';

// Where the playground page lives (inside your playwright-learning folder)
const pageUrl = 'file://' + process.cwd() + '/playground/tabs.html';

test('every tab set responds to the arrow keys', async ({ page }) => {
  // Failing checks wait up to 5 seconds each before giving up.
  // The broken tab set fails several checks, so give the test extra time.
  test.setTimeout(60000);

  // Open the playground page
  await page.goto(pageUrl);

  // Find every tab set on the page
  const tablists = await page.getByRole('tablist').all();

  for (const tablist of tablists) {
    // The tab set's name, so failures say which tab set it was
    const listName = await tablist.getAttribute('aria-label');

    // Find every tab in this tab set
    const tabs = await tablist.getByRole('tab').all();

    // Start with focus on the first tab
    // (Example 2 already checks that keyboard users can Tab here)
    await tabs[0].focus();

    // Press the Right arrow once for each remaining tab
    for (let i = 1; i < tabs.length; i++) {
      const tab = tabs[i];
      const tabName = (await tab.textContent()).trim();
      const label = listName + ' > ' + tabName;

      // Find the panel this tab controls
      const panelId = await tab.getAttribute('aria-controls');
      const panel = page.locator('#' + panelId);

      await page.keyboard.press('ArrowRight');

      // Focus, selection and panel should all have moved together
      await expect.soft(tab, label + ': should receive focus after pressing Right arrow').toBeFocused();
      await expect.soft(tab, label + ': should be selected').toHaveAttribute('aria-selected', 'true');
      await expect.soft(panel, label + ': its panel should be visible').toBeVisible();
    }
  }
});
