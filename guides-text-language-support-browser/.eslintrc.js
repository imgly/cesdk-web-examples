export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        project: './tsconfig.base.json'
      }
    },
    plugins: {
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin'))
        .default,
      deprecation: (await import('eslint-plugin-deprecation')).default
    },
    rules: {
      'deprecation/deprecation': 'error'
    }
  }
];
