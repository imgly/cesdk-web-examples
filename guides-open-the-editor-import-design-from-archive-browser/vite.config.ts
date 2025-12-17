import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // License is optional. Without a license, a watermark is shown on exports.
  // Set VITE_CESDK_LICENSE in .env to remove the watermark for production use.

  return {
    base: './',
    build: {
      target: 'es2020'
    }
  };
});
