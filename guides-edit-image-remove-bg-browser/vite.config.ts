import { defineConfig } from 'vite';
export default defineConfig(async () => {
  const plugins: any[] = [];

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
