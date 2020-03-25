import { postRequest } from '../../../services/api';
import { awBaseUrl, awHeaders, IAwAppDetails, logInfo } from '../../../utils/airwatch';

const retireAppById: (appId: number) => Promise<void> = async (appId) => {
  try {
    await postRequest(`${awBaseUrl}/mam/apps/internal/${appId}/retire`, awHeaders);
  } catch (error) {
    throw error;
  }
};

export const retireApp: (
  activeApps: IAwAppDetails[],
  previousApps: IAwAppDetails[]
) => Promise<void> = async (activeApps, previousApps) => {
  try {
    const forcePublish = process.argv.some((arg) => arg === 'force-publish');
    if (!forcePublish) {
      if (activeApps.length > 1) {
        logInfo(
          'There are more active versions of the app. Retiring the latest version. If you want to retire all previous versions you can do that manually or by passing "force-publish" when you run this script'
        );
      }
      const latestAppVersionId = previousApps[previousApps.length - 1].Id.Value;
      await retireAppById(latestAppVersionId);
    } else {
      const retirePromises: Promise<void>[] = [];
      activeApps.forEach((activeApp) => retirePromises.push(retireAppById(activeApp.Id.Value)));
      await Promise.all(retirePromises);
    }
  } catch (error) {
    throw error;
  }
};
