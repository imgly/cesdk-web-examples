import { createReadStream, cpSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

// Resolve from the consuming config so published copies use their own dependencies.
export function pdfxAssets(configURL: string): Plugin {
  const require = createRequire(configURL);
  const facade = '\0pdfx-exporter';
  let config: ResolvedConfig;
  let source: string;
  const assets = new Map<string, string>();

  function collect(directory: string, prefix: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      const name = `${prefix}${entry.name}`;
      if (entry.isDirectory()) {
        collect(path, `${name}/`);
      } else if (entry.isFile()) {
        assets.set(name, path);
      }
    }
  }

  return {
    name: 'pdfx-exporter-assets',
    enforce: 'pre',
    configResolved(resolved) {
      config = resolved;
      const directory = require.resolve
        .paths('@imgly/pdfx-exporter')
        ?.find((path) =>
          existsSync(join(path, '@imgly/pdfx-exporter/package.json'))
        );
      if (!directory) {
        throw new Error('Install @imgly/pdfx-exporter before starting Vite');
      }
      source = join(directory, '@imgly/pdfx-exporter');
      collect(join(source, 'dist'), 'dist/');
      collect(join(source, 'wasm'), 'wasm/');
    },
    resolveId(id) {
      if (id === '@imgly/pdfx-exporter') {
        return facade;
      }
    },
    load(id) {
      if (id !== facade) {
        return;
      }
      // The exporter dynamically imports its WASM glue relative to dist/.
      // Keep the package tree intact instead of bundling its loader.
      return `
        const url = new URL(
          ${JSON.stringify(`${config.base}pdfx-exporter/dist/index.js`)},
          document.baseURI
        );
        const load = () => import(/* @vite-ignore */ url.href);
        export const exportPDFX = async (...args) => (await load()).exportPDFX(...args);
        export const convertToPDFX = async (...args) => (await load()).convertToPDFX(...args);
        export const checkPDFX = async (...args) => (await load()).checkPDFX(...args);
      `;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        const prefix = `${config.base}pdfx-exporter/`;
        const path = url.pathname.startsWith(prefix)
          ? assets.get(url.pathname.slice(prefix.length))
          : undefined;
        if (!path) {
          return next();
        }
        response.setHeader(
          'Content-Type',
          path.endsWith('.wasm')
            ? 'application/wasm'
            : path.endsWith('.js')
            ? 'text/javascript'
            : 'text/plain; charset=utf-8'
        );
        const stream = createReadStream(path);
        stream.on('error', next);
        stream.pipe(response);
      });
    },
    writeBundle() {
      const destination = resolve(
        config.root,
        config.build.outDir,
        'pdfx-exporter'
      );
      for (const directory of ['dist', 'wasm']) {
        cpSync(join(source, directory), join(destination, directory), {
          recursive: true
        });
      }
      for (const file of ['LICENSE.md', 'ICC-PROFILE-LICENSES.md']) {
        cpSync(join(source, file), join(destination, file));
      }
    }
  };
}
