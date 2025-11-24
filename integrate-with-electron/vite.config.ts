import path from 'node:path';
import { defineConfig } from 'vite';
import renderer from 'vite-plugin-electron-renderer';
import electron from 'vite-plugin-electron/simple';

// https://vitejs.dev/config/

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
    plugins: [
      ...plugins,
      electron({
        main: {
          // Shortcut of `build.lib.entry`.
          entry: 'electron/main.ts'
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: path.join(__dirname, 'electron/preload.ts')
        },
        // Polyfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer:
          process.env.NODE_ENV === 'test'
            ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
              undefined
            : {}
      }),
      renderer()
    ]
  };
});
