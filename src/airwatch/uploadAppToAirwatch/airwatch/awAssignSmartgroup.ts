import { awBaseUrl, awHeaders } from '../../../utils/airwatch';
import { postRequest } from '../api/api';

const assignSmartGroup: (groupId: number, awAppId: number) => Promise<void> = async (
  groupId,
  awAppId
) => {
  try {
    const data = await postRequest(
      `${awBaseUrl}/mam/apps/internal/${awAppId}/smartgroups/${groupId}`,
      awHeaders
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const awAssignSmartgroup: (
  awAppId: number,
  smartGroupIds: number[]
) => Promise<void> = async (awAppId, smartGroupIds) => {
  try {
    const smartGroupPromises: Promise<void>[] = [];
    smartGroupIds.forEach((groupId) => {
      smartGroupPromises.push(assignSmartGroup(groupId, awAppId));
    });
    await Promise.all(smartGroupPromises);
  } catch (error) {
    throw error;
  }
};
