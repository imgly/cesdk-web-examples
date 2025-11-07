import { defineConfig, loadEnv } from 'vite';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Validate license in production builds
  if (mode === 'production' && !env.VITE_CESDK_LICENSE) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      'Warning: VITE_CESDK_LICENSE environment variable is required for production builds.\n' +
        'Get a license at: https://img.ly/forms/free-trial'
    );
  }

  const buildConfig = {
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
      (() => {
        let resolvedConfig = null;

        return {
          name: 'copy-plugin-assets',
          apply: 'build',
          configResolved(config) {
            resolvedConfig = config;
          },
          async closeBundle() {
            try {
              // Find the plugin dist folder (works with both npm and pnpm structures)
              let pluginPath = null;

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

              files.forEach((file) => {
                const sourcePath = join(pluginPath, file);
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

  return buildConfig;
});
