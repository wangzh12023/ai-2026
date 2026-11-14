import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wangzh12023.github.io',
  base: process.env.BASE_PATH || '/',
  devToolbar: { enabled: false },
  output: 'static'
});
