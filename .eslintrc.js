module.exports = {
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  extends: [
    '@lego/eslint-config-typescript',
    '@lego/eslint-config-jest',
    '@lego/eslint-config-prettier',
  ],
  rules: {
    complexity: ['error', 14],
    'max-lines-per-function': 'off',
  },
};
