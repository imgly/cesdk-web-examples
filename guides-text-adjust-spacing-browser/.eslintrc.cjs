module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "deprecation"],
  rules: {
    // Error on deprecated APIs
    "deprecation/deprecation": "error",
    // Allow console statements in examples
    "no-console": "off",
    // Allow any type in examples
    "@typescript-eslint/no-explicit-any": "off",
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  ignorePatterns: [
    "dist/**",
    "coverage/**",
    "node_modules/**",
    "*.config.js",
    "*.config.ts",
    "scripts/**",
    ".eslintrc.js",
  ],
};
