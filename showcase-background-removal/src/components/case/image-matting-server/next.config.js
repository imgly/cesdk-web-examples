/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  basePath: '',
  reactStrictMode: true,
  //distDir: 'build',
  webpack: (config, {}) => {
    config.optimization.minimize = false; // for now minimization kills safari support with threading
    config.optimization.minimizer = [];
    config.experiments.topLevelAwait = true;
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.fallback = { fs: false };

    config.plugins.push(
      new NodePolyfillPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm',
            to: 'static/chunks/pages'
          },
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
            to: 'static/chunks/pages'
          },
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm.wasm',
            to: 'static/chunks/pages'
          },
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
            to: 'static/chunks/pages'
          }
        ]
      })
    );

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];
  }
};
