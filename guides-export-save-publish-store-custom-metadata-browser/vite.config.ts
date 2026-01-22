import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const plugins: any[] = [];

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
      port: 5173
    }
  };
});
