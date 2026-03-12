import { test, expect } from '@playwright/test';

test.describe('Waitlist form — /es/waitlist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/waitlist');
  });

  test('form is visible', async ({ page }) => {
    await expect(page.locator('#waitlist-form')).toBeVisible();
  });

  test('submit without email shows validation error', async ({ page }) => {
    await page.click('#waitlist-submit');
    await expect(page.locator('#waitlist-status')).toBeVisible();
    const msg = await page.textContent('#waitlist-msg');
    expect(msg).toBeTruthy();
  });

  test('submit without accepting terms shows consent error', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('#waitlist-submit');
    const msg = await page.textContent('#waitlist-msg');
    expect(msg).toMatch(/términos|terms|acepta/i);
  });

  test('consent_terms checkbox is unchecked by default', async ({ page }) => {
    const checkbox = page.locator('input[name="consent_terms"]');
    await expect(checkbox).not.toBeChecked();
  });

  test('consent_marketing checkbox is unchecked by default', async ({ page }) => {
    const checkbox = page.locator('input[name="consent_marketing"]');
    await expect(checkbox).not.toBeChecked();
  });

  test('terms and privacy links open in new tab', async ({ page }) => {
    const termsLink = page.locator('input[name="consent_terms"] ~ span a').first();
    const href = await termsLink.getAttribute('href');
    expect(href).toBe('/es/terms');
    const target = await termsLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('honeypot field has aria-hidden and is off-screen', async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    const style = await honeypot.getAttribute('style');
    expect(style).toContain('left:-9999px');
  });
});

test.describe('Contact form — /es/contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/contact');
  });

  test('form is visible', async ({ page }) => {
    await expect(page.locator('#contact-form')).toBeVisible();
  });

  test('submit without filling required fields shows error', async ({ page }) => {
    await page.click('#contact-submit');
    await expect(page.locator('#contact-status')).toBeVisible();
    const msg = await page.textContent('#contact-msg');
    expect(msg).toBeTruthy();
  });

  test('all required fields present', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('consent_marketing checkbox is unchecked by default', async ({ page }) => {
    await expect(page.locator('input[name="consent_marketing"]')).not.toBeChecked();
  });

  test('honeypot field has aria-hidden and is off-screen', async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    const style = await honeypot.getAttribute('style');
    expect(style).toContain('left:-9999px');
  });
});

test.describe('Legal pages render content', () => {
  test('/es/privacy shows sections', async ({ page }) => {
    await page.goto('/es/privacy');
    const headings = page.locator('article h2');
    await expect(headings.first()).toBeVisible();
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('/es/terms shows sections', async ({ page }) => {
    await page.goto('/es/terms');
    const headings = page.locator('article h2');
    await expect(headings.first()).toBeVisible();
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('/es/privacy shows last updated date', async ({ page }) => {
    await page.goto('/es/privacy');
    const body = await page.textContent('main');
    expect(body).toMatch(/2026/);
  });
});
