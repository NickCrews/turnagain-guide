import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Playwright configuration for integration/browser tests.
 *
 * Tests live in __tests__/integration/. The dev server is started automatically
 * on port 1337 (matching `pnpm dev`) when running the test suite.
 *
 * If a browser binary is not found in the default Playwright cache, set
 * PLAYWRIGHT_BROWSERS_PATH to point to an existing installation, e.g.:
 *   PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright pnpm test:e2e
 */
export default defineConfig({
  testDir: path.join(__dirname, '__tests__/integration'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,

  use: {
    baseURL: 'http://localhost:1337',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Point directly to the available Chromium binary.
    // Override with CHROMIUM_PATH env var if you have Chrome installed elsewhere.
    // Falls back to the Playwright-managed binary (default behaviour).
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        // Use a desktop-sized viewport. Not using devices['Desktop Chrome'] to
        // avoid it overriding the executablePath set above.
        viewport: { width: 1280, height: 720 },
        userAgent:
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      },
    },
  ],

  webServer: {
    // Supply a dummy Cesium token so the app can start without a real one.
    // The Cesium 3D map won't load terrain/imagery with a fake token, but the
    // rest of the UI (filter bar, route list, prose) is fully testable.
    command: 'NEXT_PUBLIC_CESIUM_ACCESS_TOKEN=test-token-for-e2e pnpm dev',
    url: 'http://localhost:1337',
    // Reuse an already-running server during development to save startup time
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NEXT_PUBLIC_CESIUM_ACCESS_TOKEN:
        process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN ?? 'test-token-for-e2e',
    },
  },
});
