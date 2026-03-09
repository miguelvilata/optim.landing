# Optim Landing — Guia para IAs

Este documento describe la arquitectura, convenciones y flujos de trabajo del proyecto. Leelo antes de hacer cualquier cambio.

---

## Descripcion del proyecto

Landing page de **Optim**, una app movil de gestion de seguros y gastos recurrentes. La web es estatica (SSG), multiidioma, orientada a la conversion y a la descarga de la app.

- **App**: gestiona seguros (auto, hogar, salud, vida, moto) y suministros (luz, agua, gas, internet)
- **Plataformas**: Android (disponible), iOS (proximamente)
- **Idioma de trabajo activo**: español (`es`). No generar traducciones hasta completar `es`.
- **URL de produccion**: configurable via env `SITE_URL` (default `https://getoptim.app`)

---

## Tech stack

| Tecnologia | Version | Uso |
|---|---|---|
| [Astro](https://astro.build) | 5.x | Framework SSG, routing, componentes |
| [Tailwind CSS](https://tailwindcss.com) | 3.x | Estilos — solo utility classes |
| TypeScript | 5.x | Tipado en `.astro` frontmatter y `.ts` |
| Inter (Google Fonts) | — | Tipografia principal |
| Plausible Analytics | — | Opcional, via env `PUBLIC_ANALYTICS_DOMAIN` |

No hay framework JS de cliente (sin React/Vue/Svelte). El JavaScript en cliente es vanilla, incluido dentro de bloques `<script>` en los propios `.astro`.

---

## Estructura de archivos

```
src/
  components/          # Componentes Astro reutilizables
    LandingPage.astro  # Orquestador: importa y compone todas las secciones
    Navbar.astro
    Hero.astro
    Features.astro
    ServiceCategories.astro   # Tipos de seguro + suministros (nueva)
    HowItWorks.astro
    Screenshots.astro          # Carrusel real con imagenes de la app
    CTA.astro                  # Seccion de descarga con botones de tienda
    Footer.astro
    LanguageSelector.astro
    AppLogo.astro
    LegalPage.astro
  layouts/
    BaseLayout.astro   # HTML base: SEO, hreflang, OG, fuentes, analytics
  i18n/
    es.json            # Traducciones ES — idioma principal, editar primero
    en.json            # Traducciones EN — stub, completar despues
    pt.json            # Traducciones PT — stub, completar despues
    index.ts           # t(lang), getLangFromUrl, getAlternateUrls, supportedLangs
  pages/
    index.astro        # Redirige a /es/
    es/index.astro     # Landing ES
    en/index.astro     # Landing EN
    pt/index.astro     # Landing PT
    {lang}/privacy.astro
    {lang}/terms.astro
  config.ts            # Constantes globales: SITE_URL, GOOGLE_PLAY_URL, APP_STORE_URL
public/
  screenshots/         # Imagenes reales de la app (PNG, ~700KB c/u)
    es_dashboard.png
    es_contract_list.png
    es_finance.png
    es_contract_renovation.png
  favicon.svg
  og-image.svg
  robots.txt
```

---

## Sistema i18n

Cada seccion de la landing tiene su bloque en los JSON. El patron es:

```typescript
import { t } from '../i18n/index.ts';
const tr = t(lang);           // objeto completo del idioma
const h = tr.hero;            // seccion concreta
```

**Estructura de `es.json` (fuente de verdad):**

```
meta          → title, description, ogTitle, ogDescription
nav           → features, howItWorks, download, logoAlt
hero          → badge, title, titleHighlight, subtitle, cta, ctaSecondary, trustedBy
features      → title, subtitle, items[]  (icon, title, description)
howItWorks    → title, subtitle, steps[]  (number, title, description)
screenshots   → title, subtitle, items[]  (src, alt, caption)
serviceCategories → title, subtitle,
                    insurance.label, insurance.items[]  (icon, name)
                    utilities.label,  utilities.items[]  (icon, name)
cta           → title, subtitle, googlePlay, appStore, note
footer        → tagline, privacy, terms, language, copyright
legal         → privacy.{title,content}, terms.{title,content}
```

> **IMPORTANTE**: La key del boton principal en `cta` es `googlePlay`, NO `button`. Cambiado en la sesion actual.

Al anadir una key nueva en `es.json`, anadir tambien el equivalente en `en.json` y `pt.json` para que no rompa el build.

---

## Tokens de diseno (Tailwind)

Definidos en `tailwind.config.js`. Usar siempre estas clases, no valores arbitrarios de color.

| Token | Valor | Uso |
|---|---|---|
| `bg-brand-primary` / `text-brand-primary` | `#1A365D` | Fondo oscuro, titulos principales |
| `bg-brand-dark` | `#143250` | Marcos de movil, elementos mas oscuros |
| `text-brand-secondary` / `bg-brand-secondary` | `#3B82F6` | Azul de accion, CTAs, iconos destacados |
| `text-brand-muted` | `#475569` | Texto secundario, subtitulos |
| `bg-brand-surface` | `#F8FAFC` | Fondos de seccion claros |
| `bg-brand-light` | `#E0F2FE` | Fondos hover, backgrounds suaves |
| `bg-brand-gradient` | gradiente 135deg oscuro | Fondo del Hero y CTA |
| `animate-float` | keyframe 6s | Mockup flotante en Hero |
| `animate-fade-up` | keyframe 0.6s | Entrada de elementos |

---

## Secciones de la landing (orden)

1. **Navbar** — fija, logo + links + `LanguageSelector` + boton descarga
2. **Hero** — titular, subtitulo, botones Google Play (activo) + App Store (disabled "Proximamente")
3. **Features** — grid 2x3 de 6 caracteristicas con iconos SVG
4. **ServiceCategories** — dos columnas: Seguros y Suministros, muestra todos los tipos cubiertos
5. **HowItWorks** — 3 pasos con iconos y linea conectora (desktop)
6. **Screenshots** — carrusel con 4 capturas reales, autoplay 4s, dots + flechas, pausa en hover
7. **CTA** — bloque con gradiente, botones duales de tienda
8. **Footer** — tagline, enlaces legales, selector de idioma, copyright

---

## Variables de entorno

Crear `.env` local (no commitear):

```env
PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=...
PUBLIC_APP_STORE_URL=https://apps.apple.com/app/...   # cuando este disponible
PUBLIC_ANALYTICS_DOMAIN=tudominio.com                 # activa Plausible
SITE_URL=https://optim-app.com
```

---

## Comandos Makefile

```bash
make install     # npm install — instalar dependencias
make dev         # servidor de desarrollo en primer plano en :4321
make start       # servidor de desarrollo en segundo plano (con PID)
make stop        # para el servidor en segundo plano
make logs        # tail -f .dev.log (solo con make start)
make build       # genera la build de produccion en dist/
make preview     # build + servidor de preview
make serve       # sirve dist/ existente con npx serve en :3000
make clean       # elimina dist/ y .astro/
make clean-all   # elimina dist/, node_modules, logs
```

> **Nota**: Si `npm run build` falla con `ERR_MODULE_NOT_FOUND` en `.bin/dist/cli/index.js`,
> el symlink `node_modules/.bin/astro` se ha corrompido (archivo en lugar de symlink).
> Solucion: `ln -sf ../astro/astro.js node_modules/.bin/astro`
> Alternativa directa: `node node_modules/astro/astro.js build`

---

## Convenciones de codigo

- **Un componente = una seccion**. No crear componentes para elementos que se usan una sola vez.
- **Todos los textos en i18n**. Ningun string visible hardcodeado en los `.astro` (excepto elementos aria-label y valores de atributos no visibles).
- **Sin frameworks JS de cliente**. JS vanilla dentro de `<script>` al final del componente si es necesario (ver carrusel en `Screenshots.astro`).
- **Accesibilidad**: usar `aria-label`, `aria-hidden="true"` en decoraciones, `role` en elementos interactivos.
- **Imagenes en `public/`**: las capturas de pantalla van en `public/screenshots/`. Se referencian como `/screenshots/nombre.png`.

---

## Anadir una nueva seccion

1. Crear `src/components/NuevaSección.astro` con `interface Props { lang: Lang }` y `const tr = t(lang)`.
2. Anadir las traducciones en `es.json`, `en.json` y `pt.json`.
3. Importar y usar el componente en `src/components/LandingPage.astro`.
4. No anadir al Navbar a menos que se solicite explicitamente.

---

## Anadir/cambiar capturas de pantalla del carrusel

1. Copiar la imagen a `public/screenshots/`.
2. Editar el array `screenshots.items` en cada JSON (`es.json`, `en.json`, `pt.json`) con `src`, `alt` y `caption`.
3. El carrusel (`Screenshots.astro`) itera sobre `s.items` automaticamente — no requiere cambios en el componente.
