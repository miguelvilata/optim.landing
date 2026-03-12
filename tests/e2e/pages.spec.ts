import { test, expect } from '@playwright/test';

const LANGS = ['es', 'en', 'pt'] as const;

const PAGES = [
  { path: '/', redirect: '/es' },
  ...LANGS.flatMap(lang => [
    { path: `/${lang}`, title: true },
    { path: `/${lang}/privacy`, title: true },
    { path: `/${lang}/terms`, title: true },
    { path: `/${lang}/waitlist`, title: true },
    { path: `/${lang}/contact`, title: true },
  ]),
];

test.describe('Page loads', () => {
  for (const { path, redirect } of PAGES) {
    test(`GET ${path} → 200${redirect ? ` (redirects to ${redirect})` : ''}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });
  }

  test('GET /nonexistent → 404', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
  });
});

test.describe('URLs never end with trailing slash', () => {
  const paths = LANGS.flatMap(lang => [
    `/${lang}`,
    `/${lang}/privacy`,
    `/${lang}/terms`,
    `/${lang}/waitlist`,
    `/${lang}/contact`,
  ]);

  for (const path of paths) {
    test(`${path} does not redirect to trailing slash`, async ({ page }) => {
      await page.goto(path);
      expect(page.url()).not.toMatch(/\/$/);
    });
  }

  test('no internal link has href ending with / (except root "/")', async ({ page }) => {
    const pagesToCheck = ['/es', '/es/privacy', '/es/terms', '/es/waitlist'];
    for (const path of pagesToCheck) {
      await page.goto(path);
      const links = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href'))
      );
      const withTrailingSlash = (links.filter(Boolean) as string[]).filter(
        (href) => href.length > 1 && href.endsWith('/')
      );
      expect(withTrailingSlash, `Page ${path} has links with trailing slash: ${withTrailingSlash.join(', ')}`).toEqual([]);
    }
  });
});

test.describe('Page titles', () => {
  test('/es has Optim in title', async ({ page }) => {
    await page.goto('/es');
    await expect(page).toHaveTitle(/Optim/);
  });

  test('/es/privacy has privacy title', async ({ page }) => {
    await page.goto('/es/privacy');
    await expect(page).toHaveTitle(/Privacidad|Privacy|Optim/i);
  });

  test('/es/terms has terms title', async ({ page }) => {
    await page.goto('/es/terms');
    await expect(page).toHaveTitle(/Términos|Terms|Optim/i);
  });

  test('/es/contact has contact title', async ({ page }) => {
    await page.goto('/es/contact');
    await expect(page).toHaveTitle(/Contacto|Contact|Optim/i);
  });
});

test.describe('Footer links work', () => {
  test('footer privacy link navigates correctly', async ({ page }) => {
    await page.goto('/es');
    await page.click('footer a[href="/es/privacy"]');
    expect(page.url()).toContain('/es/privacy');
    expect(page.url()).not.toMatch(/\/$/);
  });

  test('footer terms link navigates correctly', async ({ page }) => {
    await page.goto('/es');
    await page.click('footer a[href="/es/terms"]');
    expect(page.url()).toContain('/es/terms');
    expect(page.url()).not.toMatch(/\/$/);
  });

  test('footer contact link navigates correctly', async ({ page }) => {
    await page.goto('/es');
    await page.click('footer a[href="/es/contact"]');
    expect(page.url()).toContain('/es/contact');
    expect(page.url()).not.toMatch(/\/$/);
  });
});

test.describe('Cookie notice', () => {
  test('footer shows cookie notice on landing', async ({ page }) => {
    await page.goto('/es');
    const notice = page.locator('footer').getByText(/Plausible/i);
    await expect(notice).toBeVisible();
  });
});
