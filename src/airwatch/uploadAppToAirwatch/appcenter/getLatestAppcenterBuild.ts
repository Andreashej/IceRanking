import { appcenterHeaders, appcenterOwner, appName, baseUrl } from '../../../utils/airwatch';
import { getRequest } from '../api/api';

export const getLatestAppcenterBuild: () => Promise<string> = async () => {
  try {
    const data = await getRequest(
      `${baseUrl}/${appcenterOwner}/${appName}/branches/master/builds`,
      appcenterHeaders
    );

    return `${data[0].id}`;
  } catch (error) {
    throw error;
  }
};
