import { createReadStream, existsSync } from 'fs';
import { resolve } from 'path';
import { execFileSync } from 'child_process';
import type { Plugin, UserConfig, ConfigEnv } from 'vite';

export interface CesdkLocalOptions {
  /** Relative path from example to monorepo root. Default: '../../..' */
  repoRoot?: string;

  /** Enable verbose logging. Default: false */
  verbose?: boolean;
}

type PackageOverride = 'cesdk' | 'engine' | 'node';


/**
 * Parse CESDK_USE_LOCAL environment variable into package overrides
 *
 * @param value - Environment variable value (e.g., "true", "cesdk", "engine", "cesdk,engine")
 * @returns Set of packages to override with local versions
 *
 * @example
 * parseOverrides(undefined) // Set {}
 * parseOverrides('true') // Set { 'cesdk', 'engine' }
 * parseOverrides('cesdk') // Set { 'cesdk' }
 * parseOverrides('cesdk,engine') // Set { 'cesdk', 'engine' }
 */
export function parseOverrides(
  value: string | undefined
): Set<PackageOverride> {
  const overrides = new Set<PackageOverride>();

  if (!value) return overrides;

  // Normalize: true, 1, all → all packages
  const normalized = value.toLowerCase().trim();
  if (normalized === 'true' || normalized === '1' || normalized === 'all') {
    overrides.add('cesdk');
    overrides.add('engine');
    overrides.add('node');
    return overrides;
  }

  // Specific packages
  if (normalized.includes('cesdk')) overrides.add('cesdk');
  if (normalized.includes('engine')) overrides.add('engine');
  if (normalized.includes('node')) overrides.add('node');

  return overrides;
}

/**
 * Validate that required build artifacts exist for selected packages.
 * If builds are missing, automatically runs the web:build:development command.
 *
 * @param overrides - Set of packages to validate
 * @param repoRoot - Absolute path to monorepo root
 */
export function validateBuildArtifacts(
  overrides: Set<PackageOverride>,
  repoRoot: string
): void {
  const missingBuilds: PackageOverride[] = [];

  if (overrides.has('cesdk')) {
    const buildPath = resolve(repoRoot, 'apps/cesdk_web/build/index.js');
    if (!existsSync(buildPath)) {
      missingBuilds.push('cesdk');
    }
  }

  if (overrides.has('engine')) {
    const buildPath = resolve(repoRoot, 'bindings/wasm/js_web/build/index.js');
    if (!existsSync(buildPath)) {
      missingBuilds.push('engine');
    }
  }

  if (overrides.has('node')) {
    const buildPath = resolve(repoRoot, 'bindings/wasm/js_node/build/index.js');
    if (!existsSync(buildPath)) {
      missingBuilds.push('node');
    }
  }

  if (missingBuilds.length === 0) {
    return;
  }

  console.log(`\n🔨 Local package builds missing: ${missingBuilds.join(', ')}`);
  console.log('   Running build automatically...\n');

  try {
    // web:build:development builds js_web, js_node, and cesdk_web
    console.log('📦 Building web packages (yarn web:build:development)...');
    execFileSync('yarn', ['web:build:development'], {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    console.log('\n✅ Build completed successfully!\n');
  } catch (error) {
    throw new Error(
      `Failed to build local packages. You can try running manually:\n` +
      `  yarn web:build:development\n`
    );
  }
}

/**
 * Vite plugin for seamless local/published package switching
 *
 * Enables instant switching between local monorepo packages and published npm packages
 * using the CESDK_USE_LOCAL environment variable.
 *
 * @param options - Plugin configuration options
 * @returns Vite plugin instance
 *
 * @example
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { cesdkLocal } from '../shared/vite-config-cesdk-local';
 *
 * export default defineConfig({
 *   plugins: [cesdkLocal()]
 * });
 *
 * // Usage:
 * // npm run dev                          → Published packages
 * // CESDK_USE_LOCAL=true npm run dev   → All local packages
 * // CESDK_USE_LOCAL=cesdk npm run dev  → Only local cesdk-js
 */
export function cesdkLocal(options: CesdkLocalOptions = {}): Plugin {
  const repoRoot = options.repoRoot || '../../..';
  const verbose = options.verbose || false;
  const useLocal = process.env.CESDK_USE_LOCAL;

  // Determine which packages to override
  const overrides = parseOverrides(useLocal);

  // Store aliases at plugin scope so they're available to all hooks
  let aliasMap: Record<string, string> = {};
  let absoluteRepoRoot = '';

  return {
    name: 'cesdk-local',
    enforce: 'pre', // Run before vite:import-analysis

    config(config: UserConfig, { command }: ConfigEnv) {

      // No overrides - use published packages
      if (overrides.size === 0) {
        if (verbose) {
          console.log('ℹ️  Using published packages from node_modules');
        }
        return config;
      }

      // Log which mode we're in
      if (command === 'build') {
        console.log('🏗️  Building with local packages from monorepo');
      }

      // Validate builds exist
      absoluteRepoRoot = resolve(__dirname, repoRoot);
      validateBuildArtifacts(overrides, absoluteRepoRoot);

      // Build alias configuration using directory aliases (like webpack)
      // Instead of mapping individual exports, map the package root to build dir
      aliasMap = {};

      if (overrides.has('cesdk')) {
        const buildDir = resolve(absoluteRepoRoot, 'apps/cesdk_web/build');
        aliasMap['@cesdk/cesdk-js'] = buildDir;
        console.log('✅ Using local @cesdk/cesdk-js from apps/cesdk_web/build');
      }

      if (overrides.has('engine')) {
        const buildDir = resolve(absoluteRepoRoot, 'bindings/wasm/js_web/build');
        aliasMap['@cesdk/engine'] = buildDir;
        console.log('✅ Using local @cesdk/engine from bindings/wasm/js_web/build');
      }

      if (overrides.has('node')) {
        const buildDir = resolve(absoluteRepoRoot, 'bindings/wasm/js_node/build');
        aliasMap['@cesdk/node'] = buildDir;
        console.log('✅ Using local @cesdk/node from bindings/wasm/js_node/build');
      }

      const result = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(typeof config.resolve?.alias === 'object' && !Array.isArray(config.resolve.alias) ? config.resolve.alias : {}),
            ...aliasMap
          }
        },
        // Expose env var to client code and define build-time globals
        define: {
          ...config.define,
          'import.meta.env.CESDK_USE_LOCAL': JSON.stringify(useLocal || ''),
          // Expose assets base URL for production builds (PR previews, etc.)
          'import.meta.env.VITE_CESDK_ASSETS_BASE_URL': JSON.stringify(
            process.env.VITE_CESDK_ASSETS_BASE_URL || ''
          ),
          // Define globals required by cesdk_web source code
          IMGLY_VERSION: JSON.stringify(
            process.env.IMGLY_VERSION || '0.0.0-local'
          ),
          IMGLY_NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          IMGLY_GIT_BRANCH: JSON.stringify('local-dev'),
          IMGLY_GIT_COMMIT: JSON.stringify('local-dev'),
          IMGLY_INTERNAL_DEPLOY: false
        },
        // Exclude local packages from dependency optimization
        // This prevents Vite from trying to pre-bundle them
        optimizeDeps: {
          ...config.optimizeDeps,
          exclude: [
            ...(config.optimizeDeps?.exclude || []),
            ...(overrides.has('cesdk') ? ['@cesdk/cesdk-js'] : []),
            ...(overrides.has('engine') ? ['@cesdk/engine'] : []),
            ...(overrides.has('node') ? ['@cesdk/node'] : [])
          ]
        },
        // Configure esbuild for JSX transformation
        esbuild: {
          ...config.esbuild,
          jsx: 'automatic' as const
        }
      };

      if (verbose) {
        console.log('\nℹ️  Configured aliases:');
        for (const [key, value] of Object.entries(aliasMap)) {
          const relativePath = value.replace(`${absoluteRepoRoot}/`, '');
          console.log(`   ${key} → ${relativePath}`);
        }
      }

      return result;
    },

    configureServer(server) {
      if (overrides.size === 0) return;

      // Use the absoluteRepoRoot computed in config hook, or compute if not set
      if (!absoluteRepoRoot) {
        absoluteRepoRoot = resolve(__dirname, repoRoot);
      }

      // Serve assets from the local build directory
      // This makes /assets/* requests serve from apps/cesdk_web/build/assets/*
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/assets/')) {
          const assetPath = req.url.replace('/assets/', '');
          const fullPath = resolve(
            absoluteRepoRoot,
            'apps/cesdk_web/build/assets',
            assetPath
          );

          // Check if file exists
          if (existsSync(fullPath)) {
            // Set correct MIME type for WASM files
            if (fullPath.endsWith('.wasm')) {
              res.setHeader('Content-Type', 'application/wasm');
            } else if (fullPath.endsWith('.woff2')) {
              res.setHeader('Content-Type', 'font/woff2');
            } else if (fullPath.endsWith('.woff')) {
              res.setHeader('Content-Type', 'font/woff');
            }

            // Serve the file
            const fileStream = createReadStream(fullPath);
            fileStream.pipe(res);
            return;
          }
        }
        next();
      });

      // Add watchers for local package build directories
      // When you rebuild a package, Vite will detect the change and reload
      if (overrides.has('cesdk')) {
        const cesdkBuild = resolve(absoluteRepoRoot, 'apps/cesdk_web/build');
        server.watcher.add(cesdkBuild);
        if (verbose) {
          console.log(`👀 Watching ${cesdkBuild}`);
        }
      }

      if (overrides.has('engine')) {
        const engineBuild = resolve(
          absoluteRepoRoot,
          'bindings/wasm/js_web/build'
        );
        server.watcher.add(engineBuild);
        if (verbose) {
          console.log(`👀 Watching ${engineBuild}`);
        }
      }

      if (overrides.has('node')) {
        const nodeBuild = resolve(
          absoluteRepoRoot,
          'bindings/wasm/js_node/build'
        );
        server.watcher.add(nodeBuild);
        if (verbose) {
          console.log(`👀 Watching ${nodeBuild}`);
        }
      }
    }
  };
}
