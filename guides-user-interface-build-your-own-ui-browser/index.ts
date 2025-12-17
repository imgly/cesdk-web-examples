import { Example } from './browser';

const example = new Example();
example.initialize().catch((error) => {
  console.error('Failed to initialize:', error);
});

window.addEventListener('beforeunload', () => {
  example.dispose();
});
