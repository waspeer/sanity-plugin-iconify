/**
 * One-time auth setup for Playwright e2e tests.
 *
 * Run this once to log in to the dev Studio and save the session:
 *   pnpm test:e2e:setup
 *
 * The saved session is stored in playwright/.auth/user.json (gitignored).
 * After running this, `pnpm test:e2e` will reuse the session automatically.
 */
import { mkdir } from 'fs/promises';
import { chromium } from '@playwright/test';

const authFile = new URL('./.auth/user.json', import.meta.url).pathname;

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('http://localhost:3333');

// Wait for the user to log in manually
console.log('\n👉 Please log in to the Sanity Studio in the browser window.');
console.log('   Once you are logged in and the Studio has loaded, press Enter here.\n');

await new Promise<void>((resolve) => {
  process.stdin.once('data', () => resolve());
});

await mkdir(new URL('./.auth', import.meta.url).pathname, { recursive: true });
await context.storageState({ path: authFile });
console.log(`\n✅ Auth state saved to ${authFile}`);

await browser.close();
process.exit(0);
