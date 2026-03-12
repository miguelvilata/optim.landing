import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Replace with your actual production domain
const SITE_URL = process.env.SITE_URL || 'https://optim-app.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  outDir: 'dist',
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  integrations: [tailwind()],
});
