import { describe, it, expect } from 'vitest';
import { t, getLangFromUrl, supportedLangs } from '../../src/i18n/index.ts';
import es from '../../src/i18n/es.json';

// All top-level keys that must exist in every language
const REQUIRED_TOP_KEYS = [
  'meta', 'anchors', 'nav', 'hero', 'features', 'howItWorks', 'screenshots',
  'serviceCategories', 'cta', 'footer', 'contact', 'waitlist',
  'waitlistPage', 'legal',
];

// Keys that must exist within each section
const REQUIRED_SECTION_KEYS: Record<string, string[]> = {
  anchors: ['features', 'howItWorks'],
  footer: ['legalNotice', 'privacy', 'terms', 'contact', 'cookieNotice', 'language', 'copyright', 'tagline'],
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

      it('legal.legalNotice has title, lastUpdated and non-empty sections', () => {
        const legal = tr.legal as { legalNotice: { title: string; lastUpdated: string; sections: unknown[] } };
        expect(legal.legalNotice.title).toBeTruthy();
        expect(legal.legalNotice.lastUpdated).toBeTruthy();
        expect(legal.legalNotice.sections.length).toBeGreaterThan(0);
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

// Datos que no deben aparecer en texto plano (ofuscados para bots)
const SENSITIVE_PLAIN = {
  ownerName: 'José Miguel Vilata Martínez',
  nif: '52649100F',
  email: 'privacidad@getoptim.app',
} as const;

// Marcadores que deben estar presentes para inyección por JS (visible para humanos)
const OBFUSCATION_MARKERS = [
  'data-sensitive="owner"',
  'data-sensitive="nif"',
  'data-sensitive="email"',
] as const;

function getLegalAndPrivacyStrings(tr: Record<string, unknown>): string[] {
  const out: string[] = [];
  const legal = tr.legal as Record<string, { sections?: Array<{ body?: string }> }> | undefined;
  if (legal?.legalNotice?.sections) {
    legal.legalNotice.sections.forEach((s) => { if (s.body) out.push(s.body); });
  }
  if (legal?.privacy?.sections) {
    legal.privacy.sections.forEach((s) => { if (s.body) out.push(s.body); });
  }
  if (legal?.terms?.sections) {
    legal.terms.sections.forEach((s) => { if (s.body) out.push(s.body); });
  }
  const contact = tr.contact as Record<string, string> | undefined;
  if (contact?.privacyInfoWaitlist) out.push(contact.privacyInfoWaitlist);
  if (contact?.privacyInfoContact) out.push(contact.privacyInfoContact);
  const waitlist = tr.waitlist as Record<string, string> | undefined;
  if (waitlist?.privacyInfoWaitlist) out.push(waitlist.privacyInfoWaitlist);
  if (waitlist?.privacyInfoContact) out.push(waitlist.privacyInfoContact);
  return out;
}

describe('i18n — datos sensibles ofuscados para bots', () => {
  for (const lang of supportedLangs) {
    describe(`[${lang}]`, () => {
      const tr = t(lang) as Record<string, unknown>;
      const strings = getLegalAndPrivacyStrings(tr);

      it('no contiene nombre del titular en texto plano', () => {
        for (const s of strings) {
          expect(s, `No debe aparecer el nombre en texto plano`).not.toContain(SENSITIVE_PLAIN.ownerName);
        }
      });

      it('no contiene NIF en texto plano', () => {
        for (const s of strings) {
          expect(s, `No debe aparecer el NIF en texto plano`).not.toContain(SENSITIVE_PLAIN.nif);
        }
      });

      it('no contiene email de contacto en texto plano', () => {
        for (const s of strings) {
          expect(s, `No debe aparecer el email en texto plano`).not.toContain(SENSITIVE_PLAIN.email);
        }
      });

      it('usa placeholders data-sensitive para inyección (visible para humanos)', () => {
        const concatenated = strings.join(' ');
        for (const marker of OBFUSCATION_MARKERS) {
          expect(concatenated, `Debe contener ${marker} para inyección por JS`).toContain(marker);
        }
      });
    });
  }
});
