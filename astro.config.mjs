// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  devToolbar: {
    enabled: false
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    assetsInclude: ['**/*.glb']
  }
});