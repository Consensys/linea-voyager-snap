module.exports = {
  extends: ['../../.eslintrc.js'],

  env: {
    browser: true,
    node: false,
  },

  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
