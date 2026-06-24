import { defineConfig, devices } from '@playwright/test';

// Run against on-the-fly source (default, fast) or the published dist artifact
// (PLUGIN_TARGET=dist). Dist mode builds the plugin and does a production build
// of the dev studio first, so an untranspiled/broken dist fails the run before
// the browser starts — reproducing what `sanity build` does for consumers.
const distMode = process.env.PLUGIN_TARGET === 'dist';

export default defineConfig({
  testDir: './e2e',
  globalTeardown: './playwright/global-teardown.ts',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3333',
    storageState: 'playwright/.auth/user.json',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: distMode ? 'pnpm run build && pnpm run dev:dist' : 'pnpm run dev',
    url: 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
    timeout: distMode ? 180_000 : 60_000,
  },
});
