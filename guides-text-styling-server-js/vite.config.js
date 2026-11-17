import { defineConfig } from "vite";
export default defineConfig(async () => {
  const plugins = [];

  return {
    plugins,
    build: {
      ssr: true,
      target: "node22",
      rollupOptions: {
        input: "server-js.ts",
        external: ["@cesdk/node"],
      },
    },
  };
});
