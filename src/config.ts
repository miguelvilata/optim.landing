// Site configuration
// Set environment variables to customize for your deployment

export const SITE_URL = import.meta.env.SITE || 'https://getoptim.app';

// Analytics: set PUBLIC_ANALYTICS_DOMAIN to enable Plausible Analytics
// Example: PUBLIC_ANALYTICS_DOMAIN=yourdomain.com
export const ANALYTICS_DOMAIN = import.meta.env.PUBLIC_ANALYTICS_DOMAIN || '';

// Google Play store link
export const GOOGLE_PLAY_URL = import.meta.env.PUBLIC_GOOGLE_PLAY_URL || '#';

// App Store link (iOS - coming soon)
export const APP_STORE_URL = import.meta.env.PUBLIC_APP_STORE_URL || '#';

// Supabase project URL (for Edge Functions)
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
