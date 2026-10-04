import { createReadStream, copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

// The source publisher dereferences example-local symlinks, so resolve
// dependencies from the consuming config in both the workspace and its copy.
export function conversionAssets(configURL: string): Plugin {
  const require = createRequire(configURL);
  const assets = [
    'worker.browser.js',
    'gs.js',
    'gs.wasm',
    'COPYING.AGPL-3.0',
    'LICENSE.md',
    'THIRD_PARTY_NOTICES.md',
    'PROVENANCE.md'
  ] as const;
  let config: ResolvedConfig;
  let source: string;

  return {
    name: 'pdf-conversion-assets',
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
        if (!asset) {
          return next();
        }
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
      const destination = resolve(
        config.root,
        config.build.outDir,
        'pdf-conversion'
      );
      mkdirSync(destination, { recursive: true });
      for (const asset of assets) {
        copyFileSync(join(source, asset), join(destination, asset));
      }
    }
  };
}
