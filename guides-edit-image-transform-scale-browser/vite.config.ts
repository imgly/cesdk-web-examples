import { defineConfig, type UserConfig } from 'vite';
export default defineConfig(async (): Promise<UserConfig> => {
  const plugins: any[] = [];

  return {
    plugins,
    server: {
      port: 5173
    }
  };
});
