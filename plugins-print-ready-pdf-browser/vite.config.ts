import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type ResolvedConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conditionally import local dev plugin when CESDK_USE_LOCAL is set
// This allows the example to work in both monorepo and standalone contexts
export default defineConfig(async () => {
  const plugins = [];

  if (process.env.CESDK_USE_LOCAL) {
    try {
      const { cesdkLocal } = await import(
        '../shared/vite-config-cesdk-local.js'
      );
      plugins.push(cesdkLocal());
    } catch {
      // Silently fail in standalone repos where shared folder doesn't exist
    }
  }

  return {
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    },
    optimizeDeps: {
      exclude: ['@imgly/plugin-print-ready-pdfs-web']
    },
    plugins: [
      ...plugins,
      (() => {
        let resolvedConfig: ResolvedConfig | null = null;

        return {
          name: 'copy-plugin-assets',
          apply: 'build' as const,
          configResolved(config: ResolvedConfig) {
            resolvedConfig = config;
          },
          async closeBundle() {
            try {
              // Find the plugin dist folder (works with both npm and pnpm structures)
              let pluginPath: string | null = null;

              // Try npm/yarn structure first
              const npmPath = join(
                __dirname,
                'node_modules/@imgly/plugin-print-ready-pdfs-web/dist'
              );
              if (existsSync(npmPath)) {
                pluginPath = npmPath;
              } else {
                // Try pnpm structure - search for the plugin in .pnpm directory
                const pnpmDir = join(__dirname, 'node_modules/.pnpm');
                if (existsSync(pnpmDir)) {
                  const pnpmPackages = readdirSync(pnpmDir);
                  const pluginPackage = pnpmPackages.find((pkg) =>
                    pkg.startsWith('@imgly+plugin-print-ready-pdfs-web@')
                  );
                  if (pluginPackage) {
                    pluginPath = join(
                      pnpmDir,
                      pluginPackage,
                      'node_modules/@imgly/plugin-print-ready-pdfs-web/dist'
                    );
                  }
                }
              }

              if (!pluginPath || !existsSync(pluginPath)) {
                throw new Error(
                  'Plugin dist folder not found in node_modules. Make sure @imgly/plugin-print-ready-pdfs-web is installed.'
                );
              }

              if (!resolvedConfig) {
                throw new Error('Vite config not resolved');
              }

              // Use the resolved config which includes CLI flags like --outDir
              const outDir = resolvedConfig.build.outDir;
              const assetsDir = resolvedConfig.build.assetsDir;
              const targetPath = join(outDir, assetsDir);
              mkdirSync(targetPath, { recursive: true });

              // Copy ICC profiles
              const files = [
                'ISOcoated_v2_eci.icc',
                'GRACoL2013_CRPC6.icc',
                'sRGB_IEC61966-2-1.icc'
              ];

              // At this point pluginPath is guaranteed to be non-null due to the check above
              const resolvedPluginPath = pluginPath;

              files.forEach((file) => {
                const sourcePath = join(resolvedPluginPath, file);
                const destPath = join(targetPath, file);

                if (existsSync(sourcePath)) {
                  copyFileSync(sourcePath, destPath);
                  console.log(`Copied ${file} to ${targetPath}/`);
                } else {
                  console.warn(`ICC profile not found: ${sourcePath}`);
                }
              });
            } catch (err) {
              console.error('Failed to copy plugin assets:', err);
            }
          }
        };
      })()
    ]
  };
});
