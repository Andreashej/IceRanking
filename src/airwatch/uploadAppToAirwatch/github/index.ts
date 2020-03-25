import { readFileSync } from 'fs';
import { getRequest, postRequest } from '../../../services/api';
import { downloadLocation, getAppDetails, logInfo } from '../../../utils/airwatch';

const { APP_NAME, GH_TOKEN } = process.env;
if (!APP_NAME || !GH_TOKEN) {
  throw new Error(`missing environment variables`);
}

const ghApiBaseUrl = `https://api.github.com/repos/LEGO/${APP_NAME}`;
export const uploadToGithub: () => Promise<void> = async () => {
  try {
    const { fileName } = await getAppDetails();
    const fileLocation = `${downloadLocation}/build/${fileName}`;
    logInfo('Getting the latest release information from Github');

    const { upload_url: ghAssetUploadUrl } = await getRequest(`${ghApiBaseUrl}/releases/latest`, {
      Authorization: `Bearer ${GH_TOKEN}`,
    });

    // the upload url from github ends with `/assets{?name,label}`, remove the curly braces
    const uploadUrl = ghAssetUploadUrl.split('{')[0];
    logInfo('Starting the upload to Github release assets');

    const headers = {
      Authorization: `Bearer ${GH_TOKEN}`,
      'Content-Type': 'application/octet-stream',
    };
    await postRequest(
      uploadUrl,
      headers,
      { file: readFileSync(fileLocation) },
      {
        name: fileName,
        label: fileName,
      }
    );
  } catch (error) {
    throw error;
  }
};
