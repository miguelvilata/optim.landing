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

export function getAlternateUrls(currentPath: string, siteUrl: string) {
  const pathWithoutLang = currentPath.replace(/^\/(es|en|pt)/, '');
  return supportedLangs.map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}${pathWithoutLang}`,
  }));
}
