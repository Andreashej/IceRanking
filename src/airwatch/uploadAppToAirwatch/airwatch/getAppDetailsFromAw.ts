#!/usr/bin/env node

import { getRequest } from '../../../services/api';
import { awBaseUrl, awHeaders, IAwAppDetails, logInfo } from '../../../utils';

export const getAppDetailsFromAW: (appBundleId: string) => Promise<IAwAppDetails[]> = async (
  appBundleId
) => {
  try {
    logInfo(`Searching Airwatch for app with bundle id ${appBundleId}`);

    const { Application: appDetails } = await getRequest(
      `${awBaseUrl}/mam/apps/search`,
      awHeaders,
      { bundleid: appBundleId }
    );
    //console.log(appDetails);

    return appDetails;
  } catch (error) {
    throw error;
  }
};
