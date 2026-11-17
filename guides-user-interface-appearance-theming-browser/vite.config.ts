import { defineConfig } from 'vite';
export default defineConfig(async () => {
  const plugins: any[] = [];

  return {
    plugins,
    server: {
      port: 5173
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    },
    publicDir: 'public'
  };
});
