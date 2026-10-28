// .eslintrc.cjs
// Minimal ESLint configuration — catches common mistakes (undefined
// variables, unused vars, etc.) without introducing extra plugins
// beyond what's in the approved dependency list.
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
