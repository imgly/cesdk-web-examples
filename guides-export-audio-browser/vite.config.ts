import { defineConfig } from 'vite';

// Conditionally import local dev plugin when CESDK_USE_LOCAL is set
// This allows the example to work in both monorepo and standalone contexts
export default defineConfig(async () => {
  const plugins = [];

  if (process.env.CESDK_USE_LOCAL) {
    try {
      const { cesdkLocal } = await import(
        '../shared/vite-config-cesdk-local.js'
      );
      plugins.push(cesdkLocal());
    } catch {
      // Silently fail in standalone repos where shared folder doesn't exist
    }
  }

  return {
    plugins,
    root: '.',
    publicDir: 'public',
    server: {
      port: 3000,
      open: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin'
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      copyPublicDir: true
    },
    optimizeDeps: {
      include: ['@cesdk/cesdk-js']
    }
  };
});
