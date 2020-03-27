#!/usr/bin/env node

import { postRequest } from '../../../services/api';
import { awBaseUrl, awHeaders, awOrganizationGroupId, baseAkamaiFileUrl } from '../../../utils';

export const awUploadBlob: (fileName: string) => Promise<number> = async (fileName) => {
  try {
    const uriParams = {
      filename: fileName,
      organizationgroupid: awOrganizationGroupId,
      filelink: `${baseAkamaiFileUrl}/${fileName}`,
      downloadfilefromlink: true,
      accessvia: 'Direct',
    };
    const data = await postRequest(
      `${awBaseUrl}/mam/blobs/uploadblob`,
      awHeaders,
      undefined,
      uriParams
    );

    return data.Value;
  } catch (error) {
    throw error;
  }
};
