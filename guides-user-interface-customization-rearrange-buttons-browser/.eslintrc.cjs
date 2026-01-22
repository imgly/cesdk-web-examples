module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'unicorn'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: ['^browser\\.ts$', '^index\\.ts$']
      }
    ]
  }
};
