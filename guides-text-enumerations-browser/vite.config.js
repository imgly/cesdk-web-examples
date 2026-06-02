import { defineConfig } from "vite";
export default defineConfig(async () => {
  const plugins = [];

  return {
    plugins,
    server: {
      port: 5173,
    },
  };
});
