// https://nuxt.com/docs/api/configuration/nuxt-config
import { cesdkLocal } from '../shared/vite-config-cesdk-local';

const plugins = [];
if (process.env.CESDK_USE_LOCAL) {
  plugins.push(cesdkLocal());
}

export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins,
    resolve: {
      dedupe: ['vue']
    }
  }
});
