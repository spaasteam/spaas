module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  globals: {
    document: true,
    localStorage: true,
    window: true,
    Vue: true,
  },
  extends: ['plugin:vue/essential', 'eslint-config-prettier'],
  plugins: ['vue'],
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'camelcase': 0,
    'no-unused-vars': 0,
    'func-names': 0,
  },
};
