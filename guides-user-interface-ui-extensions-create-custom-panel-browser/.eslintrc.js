module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended-typescript-error'
  ],
  ignorePatterns: ['dist', '.eslintrc.js', 'vite.config.ts', 'scripts'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'deprecation', 'jsdoc'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'deprecation/deprecation': 'error',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-returns': 'off',
    'no-console': 'error'
  }
};
