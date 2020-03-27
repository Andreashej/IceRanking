#!/usr/bin/env node

import { getRequest } from '../../../services/api';
import {
  appcenterAppName,
  appcenterBaseUrl,
  appcenterHeaders,
  appcenterOwner,
} from '../../../utils';

export interface IBuildInfo {
  id: number;
  buildNumber: string;
  queueTime: string;
  startTime: string;
  finishTime: string;
  lastChangedDate: string;
  status: string;
  result: string;
  reason: string;
  sourceBranch: string;
  sourceVersion: string;
  tags: string[];
  properties: object;
}

export const getLatestAppcenterBuild: () => Promise<string> = async () => {
  try {
    const data = await getRequest(
      `${appcenterBaseUrl}/${appcenterOwner}/${appcenterAppName}/branches/master/builds`,
      appcenterHeaders
    );

    const lastSucceededBuild = data.filter(
      (build: IBuildInfo) => build.status === 'completed' && build.result === 'succeeded'
    )[0];

    return `${lastSucceededBuild.id}`;
  } catch (error) {
    throw error;
  }
};
