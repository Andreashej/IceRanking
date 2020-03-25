import { IAwAppDetails, logInfo } from '../../../utils/airwatch';
import { createAwSmartGroup } from './createAwSmartGroup';
import { searchAwSmartGroup } from './searchAwSmartGroup';

export const getSmartGroupIds: (
  adGroupName: string,
  bundleId: string,
  version: string,
  previousApps: IAwAppDetails[],
  activeApps: IAwAppDetails[]
) => Promise<number[]> = async (adGroupName, bundleId, version, previousApps, activeApps) => {
  let smartGroupIds: number[] = [];
  if (!previousApps) {
    logInfo(`No app was found in Airwatch with the bundle id "${bundleId}"`);
    logInfo(`Searching in Airwatch for a smart group named "AD - ${adGroupName}"`);
    let groupId = await searchAwSmartGroup(adGroupName);
    if (!groupId) {
      logInfo('No smart group found, creating one for you');
      groupId = await createAwSmartGroup(adGroupName);
    }
    smartGroupIds.push(groupId);
  } else {
    const allAppVersions = previousApps.map((app) => app.AppVersion);
    if (allAppVersions.some((appVersion) => appVersion === version)) {
      throw new Error(
        `Version "${version}" already exists in Airwatch for bundle id "${bundleId}"`
      );
    }
    if (activeApps.length > 0) {
      smartGroupIds = activeApps[activeApps.length - 1].SmartGroups.map((group) => group.Id);
    } else {
      smartGroupIds = previousApps[previousApps.length - 1].SmartGroups.map((group) => group.Id);
    }
  }

  return smartGroupIds;
};
