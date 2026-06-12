import { defineConfig } from 'vite';
export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Vite's plugin type is too strict for optional local dev plugin; any[] is the pragmatic choice.
  const plugins: any[] = [];

  return {
    plugins,
    build: {
      ssr: true,
      target: 'node22',
      rollupOptions: {
        input: 'server-js.ts',
        external: ['@cesdk/node'],
      },
    },
  };
});
