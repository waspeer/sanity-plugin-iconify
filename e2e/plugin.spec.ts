import { expect, test, type Page } from '@playwright/test';

/**
 * These tests require the dev studio to be running (handled by playwright.config.ts webServer).
 * Run `pnpm test:e2e:setup` once to save your auth session before running these tests.
 */

async function selectFirstIcon(page: Page) {
  const searchInput = page.getByPlaceholder('Search for an icon...');
  await searchInput.click();
  await searchInput.pressSequentially('home');

  // Scope to the icon results list specifically — the Studio sidebar also has role="listbox"
  const results = page.getByTestId('iconify-results');
  await expect(results.locator('li').first()).toBeVisible({ timeout: 10_000 });
  await results.locator('li').first().click();
  await expect(page.getByPlaceholder('Search and replace selected icon...')).toBeVisible();
}

test.describe('icon field', () => {
  test.beforeEach(async ({ page }) => {
    // Use the intent URL to always get a fresh document (avoids reusing an existing draft)
    await page.goto('/intent/create/template=iconifyPluginTest;type=iconifyPluginTest/');
    await expect(page.getByTestId('document-panel-scroller')).toBeVisible({ timeout: 15_000 });
  });

  test('renders in the document form', async ({ page }) => {
    await expect(page.getByPlaceholder('Search for an icon...')).toBeVisible();
  });

  test('shows results when typing a search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search for an icon...');
    await searchInput.click();
    await searchInput.pressSequentially('home');
    const results = page.getByTestId('iconify-results');
    await expect(results.locator('li').first()).toBeVisible({ timeout: 10_000 });
  });

  test('selecting an icon updates the field', async ({ page }) => {
    await selectFirstIcon(page);
  });

  test('unset button clears the selected icon', async ({ page }) => {
    await selectFirstIcon(page);
    await page.getByTestId('iconify-unset').click();
    await expect(page.getByPlaceholder('Search for an icon...')).toBeVisible();
  });

  test('menu opens and closes exactly once during a search interaction', async ({ page }) => {
    // Track Popover display transitions via MutationObserver. A spurious close/reopen during
    // Studio's field activation (its focus-steal sequence) would produce ['open','close','open','close']
    // instead of the expected ['open','close'].
    await page.evaluate(() => {
      (window as any).__menuTransitions = [];
      let lastState: string | null = null;
      const results = document.querySelector('[data-testid="iconify-results"]');

      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const el = mutation.target as HTMLElement;
          if (
            mutation.attributeName === 'style' &&
            (el.style.display === 'block' || el.style.display === 'none') &&
            el.contains(results)
          ) {
            const state = el.style.display === 'block' ? 'open' : 'close';
            if (state !== lastState) {
              lastState = state;
              (window as any).__menuTransitions.push(state);
            }
          }
        }
      }).observe(document.body, { attributes: true, attributeFilter: ['style'], subtree: true });
    });

    const searchInput = page.getByPlaceholder('Search for an icon...');
    await searchInput.click();
    await searchInput.pressSequentially('home');

    const results = page.getByTestId('iconify-results');
    await expect(results.locator('li').first()).toBeVisible({ timeout: 10_000 });

    await page.getByLabel('Title').click();
    await expect(results.locator('li').first()).not.toBeVisible();

    const transitions: string[] = await page.evaluate(() => (window as any).__menuTransitions);
    expect(transitions).toEqual(['open', 'close']);
  });

  test('typing in a sibling text field is not blocked by the icon field', async ({ page }) => {
    // Select an icon so the preview component is rendered (worst-case for perf)
    await selectFirstIcon(page);

    // Throttle CPU 4x to simulate a mid-tier device and normalize timing across CI runners.
    // This makes the threshold environment-independent: normal typing at 4x throttle takes
    // ~50-400ms, while the original freeze bug (5-10s) would be ~20-40s throttled.
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    const titleField = page.getByLabel('Title');
    await titleField.click();

    const start = Date.now();
    await titleField.fill('Performance test');
    const elapsed = Date.now() - start;

    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });

    await expect(titleField).toHaveValue('Performance test');
    // 3s threshold under 4x CPU throttle — the bug caused 5-10s freezes (20-40s throttled)
    expect(elapsed).toBeLessThan(3000);
  });
});
