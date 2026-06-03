import { defineConfig, type UserConfig } from "vite";
export default defineConfig(async (): Promise<UserConfig> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [];

  return {
    plugins,
    server: {
      port: 5173,
    },
  };
});
