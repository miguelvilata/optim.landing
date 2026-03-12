// Site configuration
// Set environment variables to customize for your deployment

export const SITE_URL = import.meta.env.SITE || 'https://getoptim.app';

// Analytics: set PUBLIC_ANALYTICS_DOMAIN to enable Plausible Analytics
// Example: PUBLIC_ANALYTICS_DOMAIN=yourdomain.com
export const ANALYTICS_DOMAIN = import.meta.env.PUBLIC_ANALYTICS_DOMAIN || '';

// Google Play store link (botones y QR apuntan aquí; universal para la ficha en la tienda)
export const GOOGLE_PLAY_URL = import.meta.env.PUBLIC_GOOGLE_PLAY_URL || '#';

// App Store link (iOS - coming soon). Cuando la app tenga Android App Links / iOS Universal Links,
// se puede usar una URL de dominio (ej. SITE_URL/open) en botones y QR para abrir la app si está instalada.
export const APP_STORE_URL = import.meta.env.PUBLIC_APP_STORE_URL || '#';

// Supabase project URL (for Edge Functions)
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';

// Supabase anon key (required for Edge Function authorization)
export const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY || '';
