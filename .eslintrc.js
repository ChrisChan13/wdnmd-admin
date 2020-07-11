module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "linebreak-style": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "no-unused-expressions": "off",
    "no-fallthrough": "off",
    "no-nested-ternary": "off",
    "no-eval": "off",
  },
};
