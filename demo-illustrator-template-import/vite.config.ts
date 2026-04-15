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

// Conditionally import local dev plugin when CESDK_USE_LOCAL is set
// This allows the example to work in both monorepo and standalone contexts
export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [react(), archiveMimePlugin()];

  if (process.env.CESDK_USE_LOCAL) {
    try {
      const { cesdkLocal } =
        await import('../shared/vite-config-cesdk-local.js');
      plugins.push(cesdkLocal());
    } catch {
      // Silently fail in standalone repos where shared folder doesn't exist
    }
  }

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
