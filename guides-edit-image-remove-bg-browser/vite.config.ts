import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const plugins = [];

  if (process.env.CESDK_USE_LOCAL) {
    try {
      const { cesdkLocal } =
        await import('../shared/vite-config-cesdk-local.js');
      plugins.push(cesdkLocal());
    } catch {
      // Silently fail in standalone repos where shared folder doesn't exist
    }
  }

  return {
    plugins,
    server: {
      port: 5173,
      headers: {
        // Required headers for background-removal WASM/WebGPU
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    },
    optimizeDeps: {
      exclude: ['onnxruntime-web']
    }
  };
});
