/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conditionally import local dev helper when CESDK_USE_LOCAL is set
// This allows the example to work in both monorepo and standalone contexts
let getLocalPackageAliases = null;
let getLocalPackageAliasesTurbopack = null;
if (process.env.CESDK_USE_LOCAL) {
  try {
    const module = await import('../shared/local-package-resolver.mjs');
    getLocalPackageAliases = module.getLocalPackageAliases;
    getLocalPackageAliasesTurbopack = module.getLocalPackageAliasesTurbopack;
  } catch {
    // Silently fail in standalone repos where shared folder doesn't exist
  }
}

const nextConfig = {
  // Turbopack configuration for local development (Next.js 16+)
  // Turbopack requires relative paths instead of absolute paths
  turbopack: getLocalPackageAliasesTurbopack
    ? {
        resolveAlias: getLocalPackageAliasesTurbopack(__dirname)
      }
    : {},

  // Webpack configuration for local development (fallback for --webpack flag)
  webpack: (config) => {
    if (getLocalPackageAliases) {
      const aliases = getLocalPackageAliases(__dirname);
      config.resolve.alias = {
        ...config.resolve.alias,
        ...aliases
      };
      console.log('✅ Using local @cesdk packages from monorepo (webpack aliases)');
    }
    return config;
  }
};

export default nextConfig;
