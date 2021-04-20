#!/usr/bin/env node
import fs from 'fs';
import { Config } from '../../main';
import { logError } from '../../utils';
import { decryptCerts, setBranchConfig } from './functions';

const appcenterAppName = process.env.APPCENTER_APP_NAME;
const platform = process.env.PLATFORM || 'xcode';

export const setBuildConfiguration = async (config: Config): Promise<void> => {
  if (!config.env) {
    logError('no environment matches your current branch');

    return;
  }

  let certEncoded;
  let ppEncoded;
  try {
    if (platform === 'xcode') {
      await decryptCerts(config.env);

      certEncoded = fs.readFileSync('cert.p12').toString('BASE64');
      ppEncoded = fs.readFileSync(`${appcenterAppName}.mobileprovision`).toString('BASE64');
    }

    await setBranchConfig(
      config,
      'POST',
      certEncoded,
      'certificate.p12',
      ppEncoded,
      'pp.mobileprovision'
    );
  } catch (err) {
    if (err === 409) {
      try {
        if (platform === 'xcode' && (!certEncoded || !ppEncoded)) {
          throw new Error('Certificate or provisioning profile could not be found');
        }
        await setBranchConfig(
          config,
          'PUT',
          certEncoded,
          'certificate.p12',
          ppEncoded,
          'pp.mobileprovision'
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
