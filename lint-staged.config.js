module.exports = {
  '*.ts': [
    'eslint --fix', // 1) fix tslint issues
    'prettier --parser typescript --write', // 2) do a prettier pass
    'git add', // 3) add all changes from 1) and 2)
    'jest --bail --findRelatedTests --passWithNoTests', // 4 run all tests related to staged files that match
  ],
};
