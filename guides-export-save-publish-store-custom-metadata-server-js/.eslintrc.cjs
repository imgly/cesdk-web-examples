module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'deprecation'],
  rules: {
    'deprecation/deprecation': 'error',
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  env: {
    node: true,
    es2020: true
  },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    'node_modules/**',
    '*.config.js',
    '*.config.ts',
    'scripts/**',
    '.eslintrc.cjs'
  ]
};
