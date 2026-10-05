import { defineConfig } from 'vite';
import { conversionAssets } from './print-conversion-assets';

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
      exclude: [
        '@imgly/plugin-print-ready-pdfs-web',
        '@imgly/pdf-conversion-utils'
      ]
    },
    plugins: [conversionAssets(import.meta.url)]
  };
});
