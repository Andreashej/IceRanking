#!/usr/bin/env node

import { getAppDetails, logInfo } from '../../../utils/airwatch';
import { awAssignSmartgroup } from './awAssignSmartgroup';
import { awBeginInstall } from './awBeginInstall';
import { awUploadBlob } from './awUploadBlob';
import { getAppDetailsFromAW } from './getAppDetailsFromAw';
import { getSmartGroupIds } from './getSmartGroupIds';
import { retireApp } from './retireApp';

export const uploadToAirwatch: () => Promise<void> = async () => {
  try {
    const { AD_GROUP } = process.env;
    if (!AD_GROUP) {
      throw new Error('Missing environment variables');
    }

    logInfo('Getting app details from the .ipa file');
    const { version, bundleId, fileName, appName } = await getAppDetails();

    logInfo('Getting previous app versions from Airwatch');
    const previousApps = await getAppDetailsFromAW(bundleId);
    const activeApps = previousApps.filter((app) => app.Status === 'Active');
    const smartGroupIds = await getSmartGroupIds(
      AD_GROUP,
      bundleId,
      version,
      previousApps,
      activeApps
    );
    logInfo('Starting app retirement');
    await retireApp(activeApps, previousApps);

    logInfo('Starting to upload the app to Airwatch');
    const blobId = await awUploadBlob(fileName);

    logInfo('Starting installing the app in Airwatch');
    const awAppId = await awBeginInstall(blobId, bundleId, version, appName);

    logInfo('Assigning the smart group to the newly created app');
    await awAssignSmartgroup(awAppId, smartGroupIds);
  } catch (error) {
    throw error;
  }
};
