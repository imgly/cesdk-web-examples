import { defineConfig } from 'vite';
import { pdfxAssets } from './pdfx-assets';

export default defineConfig(async () => {
  return {
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    },
    optimizeDeps: {
      exclude: ['@imgly/pdfx-exporter']
    },
    plugins: [pdfxAssets(import.meta.url)]
  };
});
