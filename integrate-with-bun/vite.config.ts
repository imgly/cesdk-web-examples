import { defineConfig } from 'vite';
export default defineConfig(async () => {
  const plugins: any[] = [];

  return {
    plugins,
    build: {
      ssr: true,
      target: 'node22',
      rollupOptions: {
        input: 'index.ts',
        external: ['@cesdk/node']
      }
    }
  };
});
