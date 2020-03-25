#!/usr/bin/env node

import { sync as rimrafSync } from 'rimraf';
import { downloadLocation, logError, logInfo, logSuccess } from '../../utils/airwatch';
import { uploadToAirwatch } from './airwatch';
import { uploadToAkamai } from './akamai';
import { getIPA, getLatestAppcenterBuild } from './appcenter';
import { uploadToGithub } from './github';

export const uploadAppToAirwatch: () => Promise<void> = async () => {
  try {
    rimrafSync(downloadLocation);
    const buildId = process.env.APPCENTER_BUILD_ID || (await getLatestAppcenterBuild());
    logInfo(`Downloading .ipa file for build id ${buildId}`);
    await getIPA(buildId);
    logSuccess('.ipa file downloaded successfully');
    logInfo('Uploading .ipa file to the latest Github release assets');
    await uploadToGithub();
    logSuccess('Github upload successful');
    logInfo('Starting the upload to Akamai CDN');
    await uploadToAkamai();
    logSuccess('The file is successfully uploaded to Akamai CDN');
    logInfo('Starting Airwatch step');
    await uploadToAirwatch();
    logSuccess(
      'Airwatch upload successful. You can go to the LEGO App Store to view the newly created app'
    );
  } catch (error) {
    logError(error);
  }
};
