import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [cesdkLocal()],
  build: {
    modulePreload: false
  }
});

// Allows usage of a local CESDK package for development
// Place your local package in ../../cesdk and it will be used in watch mode
function cesdkLocal() {
  const cesdk = resolve(__dirname, '../../cesdk/cesdk-js');
  if (existsSync(cesdk)) {
    // eslint-disable-next-line no-console
    console.warn('Using local CESDK package');
    return {
      name: 'cesdk-local',
      config: () => ({
        resolve: {
          alias: {
            '@cesdk/cesdk-js': cesdk
          }
        }
      })
    };
  }
  // In CI or production builds, read license from environment variable
  const env = process.env.VITE_CESDK_LICENSE_KEY;
  if (env) {
    return {
      name: 'cesdk-license',
      transform(code: string, id: string) {
        if (id.endsWith('.ts')) {
          return code.replace(
            /\/\/\s*license:\s*'YOUR_LICENSE_KEY'/,
            `license: '${env}'`
          );
        }
      }
    };
  }
  return null;
}
