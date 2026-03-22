import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  envPrefix: 'SANITY_STUDIO_',
  server: {
    port: 3333,
  },
});
