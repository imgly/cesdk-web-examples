// https://nuxt.com/docs/api/configuration/nuxt-config
import { cesdkLocal } from '../shared/vite-config-cesdk-local';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins: [cesdkLocal()]
  }
});
