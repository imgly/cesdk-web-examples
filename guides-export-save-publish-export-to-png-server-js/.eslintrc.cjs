/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:deprecation/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.base.json'
  },
  plugins: ['@typescript-eslint', 'deprecation'],
  root: true,
  env: {
    node: true
  },
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'deprecation/deprecation': 'error'
  },
  ignorePatterns: ['dist/', 'node_modules/', 'scripts/', '*.js', '*.mjs', '*.cjs']
};
