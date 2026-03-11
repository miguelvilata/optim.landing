import { test, expect } from '@playwright/test';

test.describe('Language switching', () => {
  test('landing at / serves Spanish content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Optim/);
    const body = await page.textContent('body');
    expect(body).toMatch(/seguros|gastos/i);
  });

  test('language selector is visible on landing', async ({ page }) => {
    await page.goto('/es');
    // Navbar language button shows current lang code
    const btn = page.locator('nav button[aria-haspopup]').first();
    await expect(btn).toBeVisible();
  });

  test('language selector contains links to /en and /pt from /es', async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('a[href="/en"]').first()).toBeAttached();
    await expect(page.locator('a[href="/pt"]').first()).toBeAttached();
  });

  test('language selector contains link to /es from /en', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('a[href="/es"]').first()).toBeAttached();
  });

  test('navigating to /en loads English version', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Optim/);
    expect(page.url()).toContain('/en');
    expect(page.url()).not.toMatch(/\/$/);
  });

  test('navigating to /pt loads Portuguese version', async ({ page }) => {
    await page.goto('/pt');
    await expect(page).toHaveTitle(/Optim/);
    expect(page.url()).toContain('/pt');
    expect(page.url()).not.toMatch(/\/$/);
  });

  test('language selector on /es/privacy links to /en/privacy', async ({ page }) => {
    await page.goto('/es/privacy');
    await expect(page.locator('a[href="/en/privacy"]').first()).toBeAttached();
  });

  test('/en landing has English content', async ({ page }) => {
    await page.goto('/en');
    const body = await page.textContent('body');
    expect(body).toMatch(/insurance|expenses|policies/i);
  });

  test('/es landing has Spanish content', async ({ page }) => {
    await page.goto('/es');
    const body = await page.textContent('body');
    expect(body).toMatch(/seguros|gastos|pólizas/i);
  });
});
