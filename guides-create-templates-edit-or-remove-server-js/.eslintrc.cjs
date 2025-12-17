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
    // Error on deprecated APIs - catches @deprecated JSDoc tags
    'deprecation/deprecation': 'error',
    // Allow console statements in examples
    'no-console': 'off',
    // Allow any type in examples
    '@typescript-eslint/no-explicit-any': 'off'
  },
  env: {
    es2022: true,
    node: true
  },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    'node_modules/**',
    'output/**',
    '*.config.js',
    '*.config.ts',
    'scripts/**',
    '.eslintrc.cjs'
  ]
};
