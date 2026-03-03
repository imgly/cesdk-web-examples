import { defineConfig, loadEnv } from 'vite';

export default defineConfig(async ({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // License is optional. Without a license, a watermark is shown on exports.
  // Set VITE_CESDK_LICENSE in .env to remove the watermark for production use.

  const plugins: any[] = [];

  if (process.env.CESDK_USE_LOCAL) {
    try {
      const { cesdkLocal } = await import('../shared/vite-config-cesdk-local.js');
      plugins.push(cesdkLocal());
    } catch {
      // Silently fail in standalone repos where shared folder doesn't exist
    }
  }

  return {
    plugins,
    base: './',
    build: {
      target: 'es2020'
    }
  };
});
