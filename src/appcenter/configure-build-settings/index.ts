#!/usr/bin/env node
import fs from 'fs';
import { decryptCerts, setBranchConfig } from './functions';

const currentBranchName = process.env.GITHUB_REF
  ? process.env.GITHUB_REF.split('refs/heads/')[1]
  : undefined;
const appcenterAppName = process.env.APPCENTER_APP_NAME;

export const setBuildConfiguration = async () => {
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
      console.log('An error occured: ', err);
      process.exit(1);
    }
  }
};

const checkEnvVars = () => {
  if (!currentBranchName) {
    throw new Error('GITHUB_REF environment variable is undefined');
  }

  if (
    !currentBranchName.startsWith('feature/') &&
    !currentBranchName.startsWith('hotfix/') &&
    !currentBranchName.startsWith('release/') &&
    currentBranchName !== 'master' &&
    currentBranchName !== 'develop'
  ) {
    console.log('We only want whitelisted git flow branches having configurations copied into');
    process.exit(78);
  }
};
