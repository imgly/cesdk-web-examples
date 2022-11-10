import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: '.',
  e2e: {
    supportFile: false,
    setupNodeEvents() {}
  }
});
