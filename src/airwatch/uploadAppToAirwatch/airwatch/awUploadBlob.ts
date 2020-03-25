import { awBaseUrl, awHeaders, baseAkamaiFileUrl } from '../../../utils/airwatch';
import { postRequest } from '../api/api';

export const awUploadBlob: (fileName: string) => Promise<number> = async (fileName) => {
  try {
    const uriParams = {
      filename: fileName,
      organizationgroupid: 593,
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
