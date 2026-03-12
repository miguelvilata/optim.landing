import { test, expect } from '@playwright/test';

// Valores que no deben aparecer en el HTML plano (scraping/bots)
const PLAIN_MUST_NOT_APPEAR = [
  'José Miguel Vilata Martínez',
  '52649100F',
  'privacidad@getoptim.app',
];

// Después de ejecutar JS, los humanos deben ver estos datos
const VISIBLE_AFTER_LOAD = {
  ownerName: 'José Miguel Vilata Martínez',
  contactEmail: 'privacidad@getoptim.app',
};

test.describe('Datos sensibles: ofuscados para bots, visibles para humanos', () => {
  test('HTML de /es/privacidad no contiene datos sensibles en texto plano', async ({ page }) => {
    const response = await page.goto('/es/privacidad');
    expect(response?.status()).toBe(200);
    const rawHtml = (await response!.body()).toString('utf-8');

    for (const plain of PLAIN_MUST_NOT_APPEAR) {
      expect(rawHtml, `El HTML crudo no debe contener "${plain}" (ofuscado para bots)`).not.toContain(plain);
    }
  });

  test('HTML incluye script de inyección de datos sensibles', async ({ page }) => {
    await page.goto('/es/privacidad');
    const html = await page.content();

    expect(html).toContain('data-sensitive');
    expect(html).toMatch(/decodeUtf8B64|atob|base64Owner|base64Nif/);
  });

  test('Tras cargar la página, el nombre del titular es visible en el DOM', async ({ page }) => {
    await page.goto('/es/privacidad');

    const ownerEl = page.locator('[data-sensitive="owner"]').first();
    await expect(ownerEl).toBeVisible();
    await expect(ownerEl).toHaveText(VISIBLE_AFTER_LOAD.ownerName);
  });

  test('Tras cargar la página, el email de contacto es visible y el enlace es correcto', async ({ page }) => {
    await page.goto('/es/privacidad');

    const emailLink = page.locator('[data-sensitive="email"]').first();
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveText(VISIBLE_AFTER_LOAD.contactEmail);
    await expect(emailLink).toHaveAttribute('href', `mailto:${VISIBLE_AFTER_LOAD.contactEmail}`);
  });

  test('Página legal /es/legal tampoco expone datos en texto plano', async ({ page }) => {
    const response = await page.goto('/es/legal');
    expect(response?.status()).toBe(200);
    const rawHtml = (await response!.body()).toString('utf-8');

    for (const plain of PLAIN_MUST_NOT_APPEAR) {
      expect(rawHtml, `El HTML crudo no debe contener "${plain}" (ofuscado para bots)`).not.toContain(plain);
    }
  });

  test('En /es/waitlist el email de contacto se inyecta y es visible', async ({ page }) => {
    await page.goto('/es/waitlist');

    const emailLink = page.locator('[data-sensitive="email"]').first();
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveText(VISIBLE_AFTER_LOAD.contactEmail);
  });
});
