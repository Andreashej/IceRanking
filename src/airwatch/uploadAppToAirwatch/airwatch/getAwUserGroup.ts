import { getRequest } from '../../../services/api';
import { awBaseUrl, awHeaders, IAwUserGroup, logInfo } from '../../../utils/airwatch';

export const getAwUserGroup: (adGroupName: string) => Promise<IAwUserGroup> = async (
  adGroupName
) => {
  try {
    logInfo('Get the user group information from Airwatch');

    const { ResultSet: awUserGroups } = await getRequest(
      `${awBaseUrl}/v1/system/usergroups/search`,
      awHeaders,
      { groupname: adGroupName }
    );

    return awUserGroups[0];
  } catch (error) {
    throw error;
  }
};
