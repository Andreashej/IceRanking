module.exports = {
  extends: [
    '@lego/eslint-config-typescript',
    '@lego/eslint-config-jest',
    '@lego/eslint-config-prettier',
  ],
  rules: {
    complexity: ['error', 13],
    'max-lines-per-function': 'off',
  },
};