import { defineConfig, type UserConfig, type PluginOption } from 'vite';

// Conditionally import local dev plugin when CESDK_USE_LOCAL is set
// This allows the example to work in both monorepo and standalone contexts
export default defineConfig(async (): Promise<UserConfig> => {
  const plugins: PluginOption[] = [];

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
