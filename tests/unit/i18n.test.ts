import { describe, it, expect } from 'vitest';
import { t, getLangFromUrl, supportedLangs } from '../../src/i18n/index.ts';
import es from '../../src/i18n/es.json';

// All top-level keys that must exist in every language
const REQUIRED_TOP_KEYS = [
  'meta', 'nav', 'hero', 'features', 'howItWorks', 'screenshots',
  'serviceCategories', 'cta', 'footer', 'contact', 'waitlist',
  'waitlistPage', 'legal',
];

// Keys that must exist within each section
const REQUIRED_SECTION_KEYS: Record<string, string[]> = {
  footer: ['privacy', 'terms', 'contact', 'cookieNotice', 'language', 'copyright', 'tagline'],
  waitlist: [
    'title', 'subtitle', 'submit', 'submitting', 'successTitle', 'successDetail',
    'errorValidation', 'errorRateLimit', 'errorServer', 'errorConsent',
    'consentTermsPrefix', 'consentTermsAnd', 'consentMarketing',
    'confirmSuccess', 'confirmAlready', 'confirmInvalid',
  ],
  contact: [
    'metaTitle', 'metaDescription', 'title', 'subtitle',
    'namePlaceholder', 'emailPlaceholder', 'messagePlaceholder',
    'submit', 'submitting', 'successTitle', 'successDetail',
    'errorValidation', 'errorRateLimit', 'errorServer', 'errorConsent',
    'consentTermsPrefix', 'consentTermsAnd', 'consentMarketing', 'required',
  ],
};

describe('i18n — key completeness', () => {
  for (const lang of supportedLangs) {
    describe(`[${lang}]`, () => {
      const tr = t(lang) as Record<string, unknown>;

      it('has all required top-level keys', () => {
        for (const key of REQUIRED_TOP_KEYS) {
          expect(tr, `missing key "${key}"`).toHaveProperty(key);
        }
      });

      for (const [section, keys] of Object.entries(REQUIRED_SECTION_KEYS)) {
        it(`${section} has all required keys`, () => {
          const sec = tr[section] as Record<string, unknown>;
          for (const key of keys) {
            expect(sec, `[${lang}].${section} missing key "${key}"`).toHaveProperty(key);
          }
        });
      }

      it('legal.privacy has title, lastUpdated and non-empty sections', () => {
        const legal = tr.legal as { privacy: { title: string; lastUpdated: string; sections: unknown[] } };
        expect(legal.privacy.title).toBeTruthy();
        expect(legal.privacy.lastUpdated).toBeTruthy();
        expect(legal.privacy.sections.length).toBeGreaterThan(0);
      });

      it('legal.terms has title, lastUpdated and non-empty sections', () => {
        const legal = tr.legal as { terms: { title: string; lastUpdated: string; sections: unknown[] } };
        expect(legal.terms.title).toBeTruthy();
        expect(legal.terms.lastUpdated).toBeTruthy();
        expect(legal.terms.sections.length).toBeGreaterThan(0);
      });

      it('features has 6 items', () => {
        const features = tr.features as { items: unknown[] };
        expect(features.items).toHaveLength(6);
      });

      it('howItWorks has 3 steps', () => {
        const how = tr.howItWorks as { steps: unknown[] };
        expect(how.steps).toHaveLength(3);
      });

      it('screenshots has 4 items', () => {
        const screenshots = tr.screenshots as { items: unknown[] };
        expect(screenshots.items).toHaveLength(4);
      });
    });
  }
});

describe('i18n — getLangFromUrl', () => {
  it('returns es for /es/privacy', () => {
    expect(getLangFromUrl(new URL('http://x.com/es/privacy'))).toBe('es');
  });
  it('returns en for /en/', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/'))).toBe('en');
  });
  it('returns pt for /pt/contact', () => {
    expect(getLangFromUrl(new URL('http://x.com/pt/contact'))).toBe('pt');
  });
  it('defaults to es for unknown lang', () => {
    expect(getLangFromUrl(new URL('http://x.com/fr/page'))).toBe('es');
  });
});

describe('i18n — no empty strings in es', () => {
  function findEmptyStrings(obj: unknown, path = ''): string[] {
    if (typeof obj === 'string') return obj.trim() === '' ? [path] : [];
    if (Array.isArray(obj)) return obj.flatMap((v, i) => findEmptyStrings(v, `${path}[${i}]`));
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).flatMap(([k, v]) => findEmptyStrings(v, path ? `${path}.${k}` : k));
    }
    return [];
  }

  it('has no empty string values', () => {
    const empty = findEmptyStrings(es);
    expect(empty, `Empty strings at: ${empty.join(', ')}`).toHaveLength(0);
  });
});
