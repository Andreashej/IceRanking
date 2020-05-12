import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders } from '../../../../utils';
import { searchAwSmartGroup } from '../searchAwSmartGroup';

const fetchMock: FetchMock = global.fetch;

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const adGroupName = 'adGroupName';

const mockParams = {
  name: `AD - ${adGroupName}`,
};

it('returns the smart group id if the request is successful', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ SmartGroups: [{ SmartGroupID: 1 }] }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mdm/smartgroups/search`, mockParams);
  const data = await searchAwSmartGroup(adGroupName);
  expect(data).toStrictEqual(1);
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
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mdm/smartgroups/search`, mockParams);

  await expect(searchAwSmartGroup(adGroupName)).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'GET',
    },
  ]);
});
