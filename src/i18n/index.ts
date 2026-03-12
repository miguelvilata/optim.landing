import es from './es.json';
import en from './en.json';
import pt from './pt.json';

export type Lang = 'es' | 'en' | 'pt';

const translations = { es, en, pt } as const;

export function t(lang: Lang) {
  return translations[lang] ?? translations.es;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'es' || lang === 'pt') return lang;
  return 'es';
}

export const languages: Record<Lang, string> = {
  es: 'Espanol',
  en: 'English',
  pt: 'Portugues',
};

export const supportedLangs: Lang[] = ['es', 'en', 'pt'];

/** Asegura que la path no termine en / (consistente con trailingSlash: 'never'). */
export function pathWithoutTrailingSlash(path: string): string {
  return path.replace(/\/$/, '') || '/';
}

export function getAlternateUrls(currentPath: string, siteUrl: string) {
  const normalized = pathWithoutTrailingSlash(currentPath);
  const pathWithoutLang = normalized.replace(/^\/(es|en|pt)/, '') || '';
  const suffix = pathWithoutLang ? `/${pathWithoutLang.replace(/^\//, '')}` : '';
  return supportedLangs.map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}${suffix}`,
  }));
}

/** Slug de la página "Nosotros" por idioma (URL traducida). */
export const aboutPageSlug: Record<Lang, string> = {
  es: 'nosotros',
  en: 'about',
  pt: 'sobre',
};

export function getAboutPageAlternates(siteUrl: string) {
  return supportedLangs.map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}/${aboutPageSlug[lang]}`,
  }));
}

/** Slugs de páginas legales y contacto por idioma (URLs traducidas). */
export const privacyPageSlug: Record<Lang, string> = {
  es: 'privacidad',
  en: 'privacy',
  pt: 'privacidade',
};

export const termsPageSlug: Record<Lang, string> = {
  es: 'terminos-y-condiciones',
  en: 'terms',
  pt: 'termos',
};

export const contactPageSlug: Record<Lang, string> = {
  es: 'contactar',
  en: 'contact',
  pt: 'contacto',
};

export function getPrivacyPageAlternates(siteUrl: string) {
  return supportedLangs.map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}/${privacyPageSlug[lang]}`,
  }));
}

export function getTermsPageAlternates(siteUrl: string) {
  return supportedLangs.map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}/${termsPageSlug[lang]}`,
  }));
}

export function getContactPageAlternates(siteUrl: string) {
  return supportedLangs.map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}/${contactPageSlug[lang]}`,
  }));
}

/**
 * Devuelve la ruta en el idioma target para la misma "página lógica".
 * En páginas con slug traducido (privacidad, términos, contacto, nosotros)
 * genera la URL correcta (ej. /es/privacidad → /en/privacy).
 */
export function getAlternatePathForLang(currentPathname: string, targetLang: Lang): string {
  const normalized = pathWithoutTrailingSlash(currentPathname);
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 0) return `/${targetLang}`;
  const currentLang = parts[0] as Lang;
  if (currentLang !== 'es' && currentLang !== 'en' && currentLang !== 'pt') {
    return `/${targetLang}`;
  }
  const pathSegment = parts.slice(1).join('/');
  if (!pathSegment) return `/${targetLang}`;

  if (pathSegment === privacyPageSlug[currentLang]) return `/${targetLang}/${privacyPageSlug[targetLang]}`;
  if (pathSegment === termsPageSlug[currentLang]) return `/${targetLang}/${termsPageSlug[targetLang]}`;
  if (pathSegment === contactPageSlug[currentLang]) return `/${targetLang}/${contactPageSlug[targetLang]}`;
  if (pathSegment === aboutPageSlug[currentLang]) return `/${targetLang}/${aboutPageSlug[targetLang]}`;

  return `/${targetLang}/${pathSegment}`;
}
