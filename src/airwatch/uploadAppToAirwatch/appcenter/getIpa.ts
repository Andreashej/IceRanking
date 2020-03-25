#!/usr/bin/env node

import { exec } from 'child_process';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import fetch from 'node-fetch';
import { Stream } from 'stream';
import { getRequest } from '../../../services/api';
import {
  appcenterAppName,
  appcenterHeaders,
  appcenterOwner,
  baseUrl,
  downloadLocation,
  logInfo,
} from '../../../utils/airwatch';

const createFile: (fileData: Stream) => Promise<void> = (fileData) => {
  return new Promise((resolve, reject) => {
    const fileWrite = createWriteStream(`${downloadLocation}/build.zip`);
    fileData.pipe(fileWrite);
    fileWrite.on('error', () => {
      reject();
    });
    fileWrite.on('finish', () => {
      resolve();
    });
  });
};

const unzipFile: () => Promise<void> = () => {
  return new Promise((resolve, reject) => {
    exec(`unzip ${downloadLocation}/build.zip -d ${downloadLocation}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getIPA: (buildId: string) => Promise<void> = async (buildId) => {
  try {
    logInfo('Getting the download uri from Appcenter');

    const { uri: downloadUri } = await getRequest(
      `${baseUrl}/${appcenterOwner}/${appcenterAppName}/builds/${buildId}/downloads/build`,
      appcenterHeaders
    );

    logInfo('Creating temporary folder to store the file');
    if (!existsSync(downloadLocation)) {
      mkdirSync(downloadLocation);
    }

    logInfo('Downloading the file');
    const fetchParams = {
      headers: appcenterHeaders,
      responseType: 'stream',
    };
    const fileData = (await fetch(downloadUri, fetchParams)).body;

    logInfo('Saving the file in the temporary folder');
    await createFile(fileData);

    logInfo('Unzipping the downloaded file from Appcenter');
    await unzipFile();
  } catch (error) {
    throw error;
  }
};
