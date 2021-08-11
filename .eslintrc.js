module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:jest-dom/recommended',
  ],
  plugins: ['jest-dom'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
}
