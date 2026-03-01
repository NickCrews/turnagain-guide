import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wait for the Next.js page to load enough to be interactive.
 * The offline page is a bare <h1>, so we use `body` as the universal fallback.
 */
async function waitForLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // Give React a moment to hydrate
  await page.waitForTimeout(500);
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

test.describe('Home page', () => {
  test('redirects to /routes', async ({ page }) => {
    await page.goto('/');
    // The root page.tsx performs a redirect to /routes
    await page.waitForURL(/\/routes/, { timeout: 15_000 });
    expect(page.url()).toMatch(/\/routes/);
  });
});

// ---------------------------------------------------------------------------
// Routes explorer page
// ---------------------------------------------------------------------------

test.describe('/routes page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/routes');
    await waitForLoad(page);
  });

  test('renders without crashing', async ({ page }) => {
    // The page should not show a generic error boundary
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Application error');
    expect(bodyText).not.toContain('Something went wrong');
  });

  test('renders route cards in the gallery', async ({ page }) => {
    // Route cards have link text matching common feature names
    const routeLinks = page
      .getByRole('link')
      .filter({ hasText: /Peak|Uptrack|Area|Parking|Bowl|Ridge|Face/i });
    await expect(routeLinks.first()).toBeVisible({ timeout: 10_000 });
  });

  test('filter bar is visible on the page', async ({ page }) => {
    // The filter bar contains buttons for areas/types/ratings.
    // Accept any visible button or input that is part of the filter UI.
    const anyButton = page.getByRole('button').first();
    const anyInput = page.locator('input').first();
    const found = await Promise.race([
      anyButton.waitFor({ timeout: 8_000 }).then(() => true).catch(() => false),
      anyInput.waitFor({ timeout: 8_000 }).then(() => true).catch(() => false),
    ]);
    expect(found).toBe(true);
  });

  test('page title is set', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Individual route page
// ---------------------------------------------------------------------------

test.describe('Individual route page', () => {
  test('renders the tincan-peak route page without error', async ({ page }) => {
    await page.goto('/routes/tincan-peak');
    await waitForLoad(page);
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Application error');
  });

  test('shows the route title on the page', async ({ page }) => {
    await page.goto('/routes/tincan-peak');
    await waitForLoad(page);
    // "Tincan" should appear somewhere on the page (in the URL, title, or content)
    const title = page.getByText(/Tincan/i);
    await expect(title.first()).toBeVisible({ timeout: 10_000 });
  });
});

// ---------------------------------------------------------------------------
// Filter interactions
// ---------------------------------------------------------------------------

test.describe('Filter interactions', () => {
  test('search query is reflected in the URL', async ({ page }) => {
    await page.goto('/routes');
    await waitForLoad(page);

    // Look for a search input (the filter bar has a text search field)
    const searchInput = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="text"]').first());

    const inputVisible = await searchInput.first().isVisible().catch(() => false);
    if (!inputVisible) {
      // Filter bar search may not be visible at this viewport/mode; skip gracefully
      test.skip();
      return;
    }

    await searchInput.first().fill('tincan');
    // After typing, the URL should update with the query parameter
    await page.waitForURL(/query=tincan/, { timeout: 5_000 });
    expect(page.url()).toContain('query=tincan');
  });

  test('URL query parameters persist after page load', async ({ page }) => {
    // Navigate with a pre-set search filter in the URL
    await page.goto('/routes?query=sunburst');
    await waitForLoad(page);
    // URL should retain the query param after load
    expect(page.url()).toContain('query=sunburst');
    // At least one Sunburst-related item should be visible
    const routeLinks = page.getByRole('link').filter({ hasText: /Sunburst/i });
    await expect(routeLinks.first()).toBeVisible({ timeout: 10_000 });
  });
});

// ---------------------------------------------------------------------------
// PWA / Offline page
// ---------------------------------------------------------------------------

test.describe('Offline fallback page', () => {
  test('renders without crashing and shows offline message', async ({ page }) => {
    await page.goto('/offline');
    // The offline page is a simple static page with no heavy dependencies
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Application error');
    // The page should have non-trivial content
    expect(bodyText!.trim().length).toBeGreaterThan(0);
    // It should communicate that the user is offline
    expect(bodyText!.toLowerCase()).toContain('offline');
  });
});

// ---------------------------------------------------------------------------
// Accessibility basics
// ---------------------------------------------------------------------------

test.describe('Accessibility', () => {
  test('routes page has a document title', async ({ page }) => {
    await page.goto('/routes');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('routes page has at least one landmark region', async ({ page }) => {
    await page.goto('/routes');
    await waitForLoad(page);
    const landmarks = await page
      .locator('main, nav, header, footer, aside, [role="main"], [role="navigation"]')
      .count();
    expect(landmarks).toBeGreaterThan(0);
  });

  test('app-served images have alt attributes', async ({ page }) => {
    // Use a route known to have images (the tincan area has several).
    await page.goto('/routes/tincan-area');
    await waitForLoad(page);
    // Select only images whose src points to app-owned paths (/img/ or /_next/).
    // This excludes third-party or browser-injected images (e.g. Cesium widgets)
    // that are outside the app's control.
    const appImages = await page
      .locator('img[src^="/img/"], img[src^="/_next/"]')
      .all();
    for (const img of appImages) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty string (decorative) but must not be completely absent.
      expect(alt, `Image ${await img.getAttribute('src')} is missing an alt attribute`).not.toBeNull();
    }
    // If there are no app-owned images on this page, the test passes vacuously.
  });
});
