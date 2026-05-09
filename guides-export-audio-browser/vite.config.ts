import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const plugins: any[] = [];

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
