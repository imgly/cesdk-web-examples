import { defineConfig } from 'vite';
export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [];

  return {
    plugins,
    server: {
      port: 5173
    }
  };
});
