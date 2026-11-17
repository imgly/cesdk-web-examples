module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'deprecation'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'deprecation/deprecation': 'error',
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js', '*.mjs']
};
