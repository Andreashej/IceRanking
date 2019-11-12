#!/usr/bin/env node
// we allow console.logs  in this file so that a message will get printed to the user in github actions
/* eslint-disable no-console */
// exit with specific codes instead of throwing errors
/* eslint-disable no-process-exit */
import fs from 'fs';
import { decryptCerts, setBranchConfig } from './functions';

const currentBranchName = process.env.GITHUB_REF
  ? process.env.GITHUB_REF.split('refs/heads/')[1]
  : undefined;
const appcenterAppName = process.env.APPCENTER_APP_NAME;

const checkEnvVars = () => {
  if (!currentBranchName) {
    throw new Error('GITHUB_REF environment variable is undefined');
  }

  if (
    !currentBranchName.toLowerCase().startsWith('feature/') &&
    !currentBranchName.toLowerCase().startsWith('hotfix/') &&
    !currentBranchName.toLowerCase().startsWith('release/') &&
    currentBranchName.toLowerCase() !== 'master' &&
    currentBranchName.toLowerCase() !== 'develop'
  ) {
    // disable rule so that a message is printed in github actions
    // eslint-disable-next-line no-console
    console.log(
      'We only want whitelisted git flow branches having configurations copied into. For more information visit https://confluence.corp.lego.com/display/UXMP/Git+Workflow'
    );
    process.exit(78);
  }
};

// eslint-disable-next-line consistent-return
export const setBuildConfiguration: () => Promise<undefined> = async () => {
  checkEnvVars();
  let certEncoded;
  let ppEncoded;
  try {
    await decryptCerts();

    certEncoded = fs.readFileSync('cert.p12').toString('BASE64');
    ppEncoded = fs.readFileSync(`${appcenterAppName}.mobileprovision`).toString('BASE64');
    await setBranchConfig(certEncoded, 'certificate.p12', ppEncoded, 'pp.mobileprovision', 'POST');
  } catch (err) {
    if (err === 409) {
      try {
        if (!certEncoded || !ppEncoded) {
          return process.exit(1);
        }
        await setBranchConfig(
          certEncoded,
          'certificate.p12',
          ppEncoded,
          'pp.mobileprovision',
          'PUT'
        );
      } catch (error) {
        console.log('error after PUT', error);
        process.exit(1);
      }
    } else {
      console.log('An error occurred: ', err);
      process.exit(1);
    }
  }
};
