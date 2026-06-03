import { defineConfig, type UserConfig, type PluginOption } from 'vite';
export default defineConfig(async (): Promise<UserConfig> => {
  const plugins: PluginOption[] = [];

  return {
    plugins,
    server: {
      port: 5173
    }
  };
});
