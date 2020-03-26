#!/usr/bin/env node

import { getRequest } from '../../../services/api';
import {
  appcenterAppName,
  appcenterBaseUrl,
  appcenterHeaders,
  appcenterOwner,
} from '../../../utils';

export const getLatestAppcenterBuild: () => Promise<string> = async () => {
  try {
    const data = await getRequest(
      `${appcenterBaseUrl}/${appcenterOwner}/${appcenterAppName}/branches/master/builds`,
      appcenterHeaders
    );

    return `${data[0].id}`;
  } catch (error) {
    throw error;
  }
};
