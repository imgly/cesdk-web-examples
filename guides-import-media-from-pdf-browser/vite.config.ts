import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173
  },
  optimizeDeps: {
    // The importer loads its pdf.js worker from a file next to its own
    // module, so pre-bundling it would break the worker URL.
    exclude: ['@imgly/pdf-importer']
  }
});
