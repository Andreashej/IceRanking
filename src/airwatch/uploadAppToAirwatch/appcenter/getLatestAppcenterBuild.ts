import { getRequest } from '../../../services/api';
import {
  appcenterAppName,
  appcenterHeaders,
  appcenterOwner,
  baseUrl,
} from '../../../utils/airwatch';

export const getLatestAppcenterBuild: () => Promise<string> = async () => {
  try {
    const data = await getRequest(
      `${baseUrl}/${appcenterOwner}/${appcenterAppName}/branches/master/builds`,
      appcenterHeaders
    );

    return `${data[0].id}`;
  } catch (error) {
    throw error;
  }
};
