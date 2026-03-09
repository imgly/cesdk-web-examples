import { defineConfig } from 'vite';

// Configuration for vite-node to run TypeScript files
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
    plugins
  };
});
