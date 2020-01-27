#!/usr/bin/env node
// exit with specific codes instead of throwing errors
/* eslint-disable no-process-exit */
import fs from 'fs';
import { EnvType } from '../..';
import { printMsg } from '../../utils/printMsg';
import { decryptCerts, setBranchConfig } from './functions';

const appcenterAppName = process.env.APPCENTER_APP_NAME;

// eslint-disable-next-line consistent-return
export const setBuildConfiguration: (env: EnvType) => Promise<undefined> = async (env) => {
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
        printMsg(['error after PUT', error]);
        process.exit(1);
      }
    } else {
      printMsg(['An error occurred: ', err]);
      process.exit(1);
    }
  }
};
