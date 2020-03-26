#!/usr/bin/env node

import { getRequest } from '../../../services/api';
import { awBaseUrl, awHeaders } from '../../../utils';

export const searchAwSmartGroup: (adGroupName: string) => Promise<number> = async (adGroupName) => {
  try {
    const { SmartGroups: awSmartGroups } = await getRequest(
      `${awBaseUrl}/mdm/smartgroups/search`,
      awHeaders,
      { name: `AD - ${adGroupName}` }
    );

    return awSmartGroups[0].SmartGroupID;
  } catch (error) {
    throw error;
  }
};
