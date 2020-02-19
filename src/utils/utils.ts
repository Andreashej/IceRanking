export const currentBranchIsWhitelisted: (
  whitelistedBranches: string[],
  currentBranchName?: string
) => boolean = (whitelistedBranches, currentBranchName) => {
  if (!currentBranchName) {
    return false;
  }

  let branchIsValid = false;

  whitelistedBranches.forEach((branchName: string) => {
    if (currentBranchName.startsWith(branchName)) {
      branchIsValid = true;
    }
  });

  return branchIsValid;
};
