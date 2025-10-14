import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Validate required environment variables for production builds
  if (mode === 'production') {
    if (!env.VITE_CESDK_LICENSE) {
      throw new Error(
        'VITE_CESDK_LICENSE environment variable is required for production builds.\n' +
          'Please copy .env.example to .env and set your license key.'
      );
    }
  }

  return {
    server: {
      port: 5173
    }
  };
});
