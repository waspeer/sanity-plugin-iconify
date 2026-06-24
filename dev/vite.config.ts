import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Which build of the plugin the dev studio (and e2e) loads:
//   'src'  (default) → ../src/index.ts   — fast local iteration; JSX transpiled on the fly
//   'dist'           → ../dist/index.mjs — the published artifact, so a production
//                      `vite build` parses it exactly as a consumer's bundler does
//                      and catches packaging regressions (see issue #15).
const pluginTarget = process.env.PLUGIN_TARGET === 'dist' ? 'dist' : 'src';
const pluginEntry = fileURLToPath(
  new URL(pluginTarget === 'dist' ? '../dist/index.mjs' : '../src/index.ts', import.meta.url),
);

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  envPrefix: 'SANITY_STUDIO_',
  resolve: {
    alias: [{ find: /^sanity-plugin-iconify$/, replacement: pluginEntry }],
  },
  server: {
    port: 3333,
  },
  preview: {
    port: 3333,
    strictPort: true,
  },
});
