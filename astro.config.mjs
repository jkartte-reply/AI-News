// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: served at https://jkartte-reply.github.io/AI-News/
// -> site = origin, base = repo subpath. import.meta.env.BASE_URL becomes "/AI-News/".
export default defineConfig({
  site: 'https://jkartte-reply.github.io',
  base: '/AI-News',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
