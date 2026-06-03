import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [react()];

  return {
    plugins,
    server: {
      port: 5173
    },
    resolve: {
      dedupe: ['react', 'react-dom']
    }
  };
});
