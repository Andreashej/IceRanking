#!/usr/bin/env node
import fs from 'fs';
import { EnvType } from '../../main';
import { logError } from '../../utils';
import { decryptCerts, setBranchConfig } from './functions';

const appcenterAppName = process.env.APPCENTER_APP_NAME;

// eslint-disable-next-line consistent-return
export const setBuildConfiguration: (env: EnvType) => Promise<void> = async (env) => {
  let certEncoded;
  let ppEncoded;
  try {
    await decryptCerts(env);

    certEncoded = fs.readFileSync('cert.p12').toString('BASE64');
    ppEncoded = fs.readFileSync(`${appcenterAppName}.mobileprovision`).toString('BASE64');
    await setBranchConfig(certEncoded, 'certificate.p12', ppEncoded, 'pp.mobileprovision', 'POST');
  } catch (err) {
    if (err === 409) {
      try {
        if (!certEncoded || !ppEncoded) {
          throw new Error('Certificate or provisioning profile could not be found');
        }
        await setBranchConfig(
          certEncoded,
          'certificate.p12',
          ppEncoded,
          'pp.mobileprovision',
          'PUT'
        );
      } catch (error) {
        logError(['error after PUT', error]);
        throw error;
      }
    } else {
      logError(['An error occurred: ', err]);
      throw err;
    }
  }
};
