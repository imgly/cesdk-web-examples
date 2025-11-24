module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  ignorePatterns: [
    'dist/**',
    'output/**',
    'coverage/**',
    'node_modules/**',
    '*.config.js',
    '*.config.ts',
    'scripts/**',
    '.eslintrc.cjs'
  ],
  plugins: ['@typescript-eslint', 'deprecation', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended'
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'deprecation/deprecation': 'error',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off'
  },
  env: {
    node: true,
    es2020: true
  }
};
