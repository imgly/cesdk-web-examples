import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Note: CE.SDK requires support for BigInt literals.
  // This configuration uses the solution described in this issue:
  // https://github.com/sveltejs/kit/issues/859#issuecomment-1184696144
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020'
  }
});
