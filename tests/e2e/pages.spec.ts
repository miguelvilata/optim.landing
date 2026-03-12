import { test, expect } from '@playwright/test';

const LANGS = ['es', 'en', 'pt'] as const;
// Slugs por idioma (duplicados de src/i18n/index.ts para evitar importar JSON en el runner)
const privacyPageSlug: Record<(typeof LANGS)[number], string> = {
  es: 'privacidad',
  en: 'privacy',
  pt: 'privacidade',
};
const termsPageSlug: Record<(typeof LANGS)[number], string> = {
  es: 'terminos-y-condiciones',
  en: 'terms',
  pt: 'termos',
};
const contactPageSlug: Record<(typeof LANGS)[number], string> = {
  es: 'contactar',
  en: 'contact',
  pt: 'contacto',
};

const PAGES = [
  { path: '/', redirect: '/es' },
  ...LANGS.flatMap((lang) => [
    { path: `/${lang}`, title: true },
    { path: `/${lang}/${privacyPageSlug[lang]}`, title: true },
    { path: `/${lang}/${termsPageSlug[lang]}`, title: true },
    { path: `/${lang}/waitlist`, title: true },
    { path: `/${lang}/${contactPageSlug[lang]}`, title: true },
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
  const paths = LANGS.flatMap((lang) => [
    `/${lang}`,
    `/${lang}/${privacyPageSlug[lang]}`,
    `/${lang}/${termsPageSlug[lang]}`,
    `/${lang}/waitlist`,
    `/${lang}/${contactPageSlug[lang]}`,
  ]);

  for (const path of paths) {
    test(`${path} does not redirect to trailing slash`, async ({ page }) => {
      await page.goto(path);
      expect(page.url()).not.toMatch(/\/$/);
    });
  }

  test('no internal link has href ending with / (except root "/")', async ({ page }) => {
    const pagesToCheck = ['/es', '/es/privacidad', '/es/terminos-y-condiciones', '/es/waitlist'];
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

  test('/es/privacidad has privacy title', async ({ page }) => {
    await page.goto('/es/privacidad');
    await expect(page).toHaveTitle(/Privacidad|Privacy|Optim/i);
  });

  test('/es/terminos-y-condiciones has terms title', async ({ page }) => {
    await page.goto('/es/terminos-y-condiciones');
    await expect(page).toHaveTitle(/Términos|Terms|Optim/i);
  });

  test('/es/contactar has contact title', async ({ page }) => {
    await page.goto('/es/contactar');
    await expect(page).toHaveTitle(/Contacto|Contact|Optim/i);
  });
});

test.describe('Footer links work', () => {
  test('footer privacy link navigates correctly', async ({ page }) => {
    await page.goto('/es');
    await page.click('footer a[href="/es/privacidad"]');
    expect(page.url()).toContain('/es/privacidad');
    expect(page.url()).not.toMatch(/\/$/);
  });

  test('footer terms link navigates correctly', async ({ page }) => {
    await page.goto('/es');
    await page.click('footer a[href="/es/terminos-y-condiciones"]');
    expect(page.url()).toContain('/es/terminos-y-condiciones');
    expect(page.url()).not.toMatch(/\/$/);
  });

  test('footer contact link navigates correctly', async ({ page }) => {
    await page.goto('/es');
    await page.click('footer a[href="/es/contactar"]');
    expect(page.url()).toContain('/es/contactar');
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
