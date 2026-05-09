import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
/**
 * Plugin to handle .archive files with correct MIME type.
 * CE.SDK scene archives are ZIP files that need application/zip Content-Type.
 */
function archiveMimePlugin(): Plugin {
  return {
    name: 'archive-mime',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.archive')) {
          res.setHeader('Content-Type', 'application/zip');
        }
        next();
      });
    }
  };
}

export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [react(), archiveMimePlugin()];

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
