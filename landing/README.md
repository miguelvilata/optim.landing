# Optim Landing Page

Landing page estatica multiidioma para la aplicacion movil **Optim: Seguros y Gastos**.

Construida con [Astro](https://astro.build) y TailwindCSS. No requiere servidor — genera HTML puro desplegable en cualquier CDN o hosting estatico.

---

## Descripcion

Esta web de marketing presenta la app Optim y permite a los usuarios descargarla desde Google Play. Soporta tres idiomas (espanol, ingles y portugues) con URLs independientes por idioma y etiquetas `hreflang` para SEO multilingue.

**Tecnologias:**
- [Astro 4](https://astro.build) — generador de sitios estaticos
- [TailwindCSS 3](https://tailwindcss.com) — estilos utility-first
- Sin JavaScript en el cliente (salvo analytics opcional)

---

## Requisitos

- Node.js >= 18
- npm >= 9

---

## Instalacion

```bash
cd landing
make install
```

---

## Desarrollo

Arranca el servidor de desarrollo con recarga automatica:

```bash
make dev
# Abre http://localhost:4321
```

O en segundo plano:

```bash
make start          # arranca en background
make logs           # sigue los logs en tiempo real
make stop           # para el servidor
```

---

## Build de produccion

```bash
make build
# Genera los archivos estaticos en landing/dist/
```

Para previsualizar la build antes de desplegar:

```bash
make preview
# Abre http://localhost:4321
```

O con un servidor estatico independiente:

```bash
make serve
# Abre http://localhost:3000
```

> **Importante:** no abras `dist/index.html` directamente en el navegador. Los paths de assets son absolutos y requieren un servidor HTTP.

---

## Configuracion

Crea un archivo `.env` en la carpeta `landing/` (nunca lo subas al repositorio):

```env
# Dominio de produccion (afecta a URLs canonicas y sitemap)
SITE_URL=https://tu-dominio.com

# URL de la app en Google Play
PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=com.pepisoft.optim

# Dominio para Plausible Analytics (dejar vacio para desactivar)
PUBLIC_ANALYTICS_DOMAIN=tu-dominio.com
```

---

## Estructura del proyecto

```
landing/
├── Makefile
├── astro.config.mjs
├── tailwind.config.js
├── package.json
│
├── public/
│   ├── favicon.svg          # Icono de la app
│   ├── og-image.svg         # Imagen para redes sociales (1200x630)
│   ├── robots.txt
│   └── sitemap.xml          # Sitemap multilingue
│
└── src/
    ├── config.ts             # Variables de entorno globales
    ├── i18n/
    │   ├── es.json           # Textos en espanol
    │   ├── en.json           # Textos en ingles
    │   ├── pt.json           # Textos en portugues
    │   └── index.ts          # Utilidades de traduccion
    ├── layouts/
    │   └── BaseLayout.astro  # HTML base, SEO, OG tags, hreflang
    ├── components/
    │   ├── Navbar.astro
    │   ├── Hero.astro
    │   ├── Features.astro
    │   ├── HowItWorks.astro
    │   ├── Screenshots.astro
    │   ├── CTA.astro
    │   ├── Footer.astro
    │   └── LanguageSelector.astro
    └── pages/
        ├── index.astro        # Landing en espanol (ruta raiz)
        ├── es/                # /es/ /es/privacy/ /es/terms/
        ├── en/                # /en/ /en/privacy/ /en/terms/
        └── pt/                # /pt/ /pt/privacy/ /pt/terms/
```

---

## Rutas generadas

| Ruta | Contenido |
|---|---|
| `/` | Landing en espanol |
| `/es/` | Landing en espanol |
| `/en/` | Landing en ingles |
| `/pt/` | Landing en portugues |
| `/{lang}/privacy/` | Politica de privacidad |
| `/{lang}/terms/` | Terminos y condiciones |

---

## Anadir un idioma nuevo

1. Copia `src/i18n/es.json` → `src/i18n/[codigo].json` y traduce los textos
2. Registra el idioma en `src/i18n/index.ts` (añadelo a `translations`, `languages` y `supportedLangs`)
3. Crea las paginas en `src/pages/[codigo]/` (index, privacy, terms)
4. Añade las URLs al `public/sitemap.xml`

---

## Despliegue

El contenido de `dist/` es completamente estatico y se puede subir a cualquier hosting.

**Supabase Storage:**
```bash
make build
# Sube la carpeta dist/ a tu bucket de Supabase Storage
# Configura el bucket para servir archivos publicos estaticos
```

**Netlify / Vercel:**
Apunta el directorio raiz a `landing/`, comando de build `make build`, carpeta de salida `dist`.

**Servidor propio:**
```bash
make build
rsync -avz dist/ usuario@servidor:/var/www/optim-landing/
```

---

## Comandos disponibles

```bash
make help        # Lista todos los comandos
make install     # Instala dependencias
make dev         # Servidor de desarrollo (primer plano)
make start       # Servidor de desarrollo (segundo plano)
make stop        # Para el servidor en segundo plano
make logs        # Sigue los logs del servidor
make build       # Build de produccion → dist/
make preview     # Preview de la build en local
make serve       # Sirve dist/ con npx serve
make clean       # Elimina dist/
make clean-all   # Elimina dist/ y node_modules
```
