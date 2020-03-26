import { appendParamsToUrl } from '../../../services/api';
import {
  appcenterAppName,
  appcenterBaseUrl,
  appcenterHeaders,
  appcenterOwner,
  fetchMock,
} from '../../../utils';
import { getIPA } from './getIpa';

const buildId = '1';
const mockBuildUrl = appendParamsToUrl(
  `${appcenterBaseUrl}/${appcenterOwner}/${appcenterAppName}/builds/${buildId}/downloads/build`
);
const mockDownloadUrl = `https://download.uri`;

beforeEach(() => {
  jest.mock('fs');
});
afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

it('throws if it fails to get the download uri', async () => {
  fetchMock.mockRejectOnce(new Error('test'));
  await expect(getIPA(buildId)).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockBuildUrl,
    {
      headers: appcenterHeaders,
      method: 'GET',
    },
  ]);
});

it('throws if it fails to get the file data', async () => {
  fetchMock
    .once(JSON.stringify({ uri: mockDownloadUrl }))
    .once(() => Promise.reject(new Error('fileData error')));

  await expect(getIPA(buildId)).rejects.toThrow('fileData error');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockBuildUrl,
    {
      headers: appcenterHeaders,
      method: 'GET',
    },
  ]);

  expect(fetchMock.mock.calls[1]).toEqual([
    mockDownloadUrl,
    {
      headers: appcenterHeaders,
      responseType: 'stream',
    },
  ]);
});
