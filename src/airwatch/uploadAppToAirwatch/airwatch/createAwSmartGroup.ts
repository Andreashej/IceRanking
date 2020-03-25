import { awBaseUrl, awHeaders, logInfo } from '../../../utils/airwatch';
import { postRequest } from '../api/api';
import { getAwUserGroup } from './getAwUserGroup';

export const createAwSmartGroup: (adGroupName: string) => Promise<number> = async (adGroupName) => {
  try {
    logInfo('Creating a new Smart Group in Airwatch');
    const awUserGroup = await getAwUserGroup(adGroupName);
    if (!awUserGroup) {
      throw new Error(
        `No user group found with the name ${adGroupName}. Please create one first by following the documentation at https://confluence.corp.lego.com/display/UXMP/Airwatch+Group+Assignment`
      );
    }

    const body = {
      Name: `AD - ${adGroupName}`,
      ManagedByOrganizationGroupId: 593,
      UserGroups: [
        {
          Id: awUserGroup.id,
        },
      ],
    };
    const data = await postRequest(`${awBaseUrl}/mdm/smartgroups`, awHeaders, body);

    // value here is the ID of the newly created smart group
    return data.Value;
  } catch (error) {
    throw error;
  }
};
