#!/usr/bin/env node

/**
 * Webpack/Next.js package alias resolver for local development
 *
 * This module provides webpack alias configuration to point package imports
 * to local monorepo sources instead of node_modules during development.
 *
 * Usage in webpack/Next.js config:
 *   import { getLocalPackageAliases } from '../shared/local-package-resolver.mjs';
 *   const aliases = getLocalPackageAliases(__dirname);
 *   config.resolve.alias = { ...config.resolve.alias, ...aliases };
 */

import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

/**
 * Get webpack aliases for local package development (absolute paths)
 * @param {string} exampleDir - The example directory path
 * @returns {Object} Webpack alias configuration with absolute paths
 */
export function getLocalPackageAliases(exampleDir) {
  // Resolve monorepo root (3 levels up from example dir)
  const repoRoot = resolve(exampleDir, '../../..');

  const aliases = {
    // Point @cesdk/cesdk-js to local build output
    '@cesdk/cesdk-js': resolve(repoRoot, 'apps/cesdk_web/build/'),

    // Point @cesdk/engine to local build output
    '@cesdk/engine': resolve(repoRoot, 'bindings/wasm/js_web/build/'),

    // Point @cesdk/node to local build output
    '@cesdk/node': resolve(repoRoot, 'bindings/wasm/js_node/build/')
  };

  console.log('✅ Using local @cesdk packages from monorepo (webpack aliases)');

  return aliases;
}

/**
 * Get Turbopack aliases for local package development (relative paths)
 * Turbopack requires relative paths instead of absolute paths
 * @param {string} exampleDir - The example directory path
 * @returns {Object} Turbopack alias configuration with relative paths
 */
export function getLocalPackageAliasesTurbopack(exampleDir) {
  // Resolve monorepo root (3 levels up from example dir)
  const repoRoot = resolve(exampleDir, '../../..');

  const aliases = {
    // Point @cesdk/cesdk-js to local build output (relative path)
    '@cesdk/cesdk-js': relative(exampleDir, resolve(repoRoot, 'apps/cesdk_web/build/')),

    // Point @cesdk/engine to local build output (relative path)
    '@cesdk/engine': relative(exampleDir, resolve(repoRoot, 'bindings/wasm/js_web/build/')),

    // Point @cesdk/node to local build output (relative path)
    '@cesdk/node': relative(exampleDir, resolve(repoRoot, 'bindings/wasm/js_node/build/'))
  };

  console.log('✅ Using local @cesdk packages from monorepo (turbopack aliases)');

  return aliases;
}

// For CLI usage (debugging)
if (import.meta.url === `file://${process.argv[1]}`) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const exampleDir = resolve(__dirname, '..');
  const aliases = getLocalPackageAliases(exampleDir);
  console.log('Webpack aliases:', JSON.stringify(aliases, null, 2));
}
