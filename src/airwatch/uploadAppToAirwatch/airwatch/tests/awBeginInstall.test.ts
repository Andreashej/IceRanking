import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders, awOrganizationGroupId } from '../../../../utils';
import { awBeginInstall } from '../awBeginInstall';

const fetchMock: FetchMock = global.fetch;

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});
const mockBody = JSON.stringify({
  ApplicationName: 'testApp',
  BlobId: 1,
  DeviceType: '2',
  BundleId: 'com.lego.corp.bundleid',
  ActualFileVersion: '1.0.0',
  LocationGroupId: awOrganizationGroupId,
  PushMode: 'OnDemand',
  UploadViaLink: true,
  SupportedModels: {
    Model: [{ ModelName: 'iPhone' }],
  },
});

it('returns the id if the request is successful', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ Id: { Value: 10 } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/begininstall`);
  const data = await awBeginInstall(1, 'com.lego.corp.bundleid', '1.0.0', 'testApp');
  expect(data).toStrictEqual(10);

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
      body: mockBody,
    },
  ]);
});

it('throws if the request fails', async () => {
  fetchMock.mockRejectOnce(new Error('test'));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/begininstall`);

  await expect(awBeginInstall(1, 'com.lego.corp.bundleid', '1.0.0', 'testApp')).rejects.toThrow(
    'test'
  );

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
      body: mockBody,
    },
  ]);
});
