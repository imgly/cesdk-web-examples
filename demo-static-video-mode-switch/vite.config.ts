import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react()];

  return {
    plugins,
    server: {
      port: 5173
    },
    // Prevent duplicate React instances in production builds
    // This is critical when using @cesdk/cesdk-js/react component
    resolve: {
      dedupe: ['react', 'react-dom']
    }
  };
});
