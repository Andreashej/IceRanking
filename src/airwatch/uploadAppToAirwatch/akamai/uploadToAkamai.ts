#!/usr/bin/env node

import { readFileSync, writeFile } from 'fs';
import { scp as sftpUpload } from 'scp2';
import { downloadLocation, getAppDetails, logInfo, privateKeyLocation } from '../../../utils';

export interface ISftpOptions {
  host: string;
  username: string;
  path?: string;
  files?: string[];
  remoteDir: string;
  privateKey: Buffer;
  passphrase: string;
  excludedFolders?: string[];
  basePath?: string;
}

const createPrivateKeyFile: () => Promise<void> = () => {
  return new Promise((resolve, reject) => {
    const { PRIVATE_KEY } = process.env;
    writeFile(privateKeyLocation, PRIVATE_KEY, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const uploadToAkamai: () => Promise<void> = () => {
  return new Promise((resolve, reject) => {
    const { PRIVATE_KEY_PASSPHRASE } = process.env;
    logInfo('Getting the app details from the downloaded file');
    getAppDetails()
      .then((appDetails) => {
        const { fileName } = appDetails;
        logInfo('Creating the private key file');
        createPrivateKeyFile()
          .then(() => {
            logInfo('Starting the upload to CDN');
            sftpUpload(
              `${downloadLocation}/build/${fileName}`,
              {
                host: 'legomac.upload.akamai.com',
                username: 'sshacs',
                path: `./`,
                // path: `/439410/ios`,
                //IMPORTANT: use node 8.11.3
                privateKey: readFileSync(privateKeyLocation),
                passphrase: PRIVATE_KEY_PASSPHRASE,
              },
              (err: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};
