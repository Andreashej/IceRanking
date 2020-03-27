import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders } from '../../../../utils';
import { getAppDetailsFromAW } from '../getAppDetailsFromAw';

const fetchMock: FetchMock = global.fetch;

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const bundleId = 'com.lego.corp.bundleId';
const mockParams = {
  bundleid: bundleId,
};

it('returns the app details if the request is successful', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ Application: [{ ApplicationName: 'appName' }] }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/search`, mockParams);
  const data = await getAppDetailsFromAW(bundleId);
  expect(data[0].ApplicationName).toStrictEqual('appName');
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'GET',
    },
  ]);
});

it('throws if the request fails', async () => {
  fetchMock.mockRejectOnce(new Error('test'));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/search`, mockParams);

  await expect(getAppDetailsFromAW(bundleId)).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'GET',
    },
  ]);
});
