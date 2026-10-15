import { createReadStream, copyFileSync, cpSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { ResolvedConfig, UserConfig } from 'vite';

const assets = [
  'worker.browser.js',
  'gs.js',
  'gs.wasm',
  'COPYING.AGPL-3.0',
  'LICENSE.md',
  'THIRD_PARTY_NOTICES.md',
  'PROVENANCE.md'
] as const;

// Example-local symlinks are dereferenced by the source publisher. Resolve
// dependencies from the consuming config in both the workspace and its copy.
export function epsViteConfig(configURL: string): UserConfig {
  const require = createRequire(configURL);
  let config: ResolvedConfig;
  let source: string;
  return {
    server: { port: 5173, strictPort: true },
    optimizeDeps: {
      // Discovering this lazy dependency on upload would reload the page mid-import.
      include: ['@imgly/eps-importer > pdf-lib'],
      exclude: [
        '@imgly/eps-importer',
        '@imgly/pdf-importer',
        '@imgly/pdf-conversion-utils'
      ]
    },
    plugins: [
      {
        name: 'eps-conversion-assets',
        configResolved(resolved) {
          config = resolved;
          source = dirname(
            require.resolve('@imgly/pdf-conversion-utils/assets/gs.wasm')
          );
        },
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            const url = new URL(request.url ?? '/', 'http://localhost');
            const asset = assets.find(
              (file) => url.pathname === `${config.base}pdf-conversion/${file}`
            );
            if (!asset) return next();
            response.setHeader(
              'Content-Type',
              asset.endsWith('.wasm')
                ? 'application/wasm'
                : asset.endsWith('.js')
                  ? 'text/javascript'
                  : 'text/plain; charset=utf-8'
            );
            const stream = createReadStream(join(source, asset));
            stream.on('error', next);
            stream.pipe(response);
          });
        },
        writeBundle() {
          const destination = join(config.build.outDir, 'pdf-conversion');
          mkdirSync(destination, { recursive: true });
          for (const asset of assets)
            copyFileSync(join(source, asset), join(destination, asset));
          const pdfDirectory = dirname(require.resolve('@imgly/pdf-importer'));
          cpSync(
            join(pdfDirectory, 'standard_fonts'),
            join(config.build.outDir, config.build.assetsDir, 'standard_fonts'),
            { recursive: true }
          );
        }
      }
    ]
  };
}
