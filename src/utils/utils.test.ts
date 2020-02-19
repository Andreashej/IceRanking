import { currentBranchIsWhitelisted } from './utils';

const whitelistedBranches = ['develop', 'feature/'];
describe('currentBranchIsWhitelisted', () => {
  it('returns `false` if there is no current branch', () => {
    const result = currentBranchIsWhitelisted(whitelistedBranches);
    expect(result).toStrictEqual(false);
  });

  it('returns `false` if the current branch is not whitelisted', () => {
    const result = currentBranchIsWhitelisted(whitelistedBranches, 'master');
    expect(result).toStrictEqual(false);
  });

  it('returns `true` if the current branch is whitelisted', () => {
    const result = currentBranchIsWhitelisted(whitelistedBranches, 'feature/testBranch');
    expect(result).toStrictEqual(true);
  });
});
