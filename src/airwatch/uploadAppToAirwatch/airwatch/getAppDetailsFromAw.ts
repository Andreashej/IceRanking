import { awBaseUrl, awHeaders, IAwAppDetails, logInfo } from '../../../utils/airwatch';
import { getRequest } from '../api/api';

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

    return appDetails;
  } catch (error) {
    throw error;
  }
};
