module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'deprecation', 'jsdoc'],
  root: true,
  parserOptions: {
    project: './tsconfig.base.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    'deprecation/deprecation': 'error',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  env: {
    browser: true,
    es2020: true
  },
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.js', 'scripts']
};
