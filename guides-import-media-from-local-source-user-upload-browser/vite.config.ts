import { defineConfig } from 'vite';
export default defineConfig(async () => {
  const plugins: any[] = [];

  return {
    plugins,
    server: {
      port: 5173
    }
  };
});
