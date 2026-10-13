module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'deprecation'],
  rules: {
    'deprecation/deprecation': 'error',
    'no-console': 'off'
  },
  env: {
    es2022: true,
    node: true
  },
  ignorePatterns: ['dist/**', 'output/**', 'node_modules/**', '*.config.js']
};
