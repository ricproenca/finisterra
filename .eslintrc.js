module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  rules: {
    'linebreak-style': ['warn', 'windows'],
    'no-underscore-dangle': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'no-mixed-operators': 0,
    'class-methods-use-this': 0,
  },
};
