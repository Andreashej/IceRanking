module.exports = {
  parserOptions: {
    project: './tsconfig.eslint.json',
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
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        // disable require imports rule because the module needs to be imported using 'require' in
        // test files in order to be able to mock it's functions
        '@typescript-eslint/no-var-requires': 'off',
        // disable the rule because some tests import mocked data, not a module mock
        'jest/no-mocks-import': 'off',
      },
    },
  ],
};
