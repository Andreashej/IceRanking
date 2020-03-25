import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders, fetchMock } from '../../../../utils';
import { getAwUserGroup } from '../getAwUserGroup';

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const adGroupName = 'adGroupName';
const mockParams = {
  groupname: adGroupName,
};

it('returns the user group if the request is successful', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ResultSet: [{ groupName: 'mockGroupName' }] }));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/v1/system/usergroups/search`, mockParams);
  const data = await getAwUserGroup(adGroupName);
  expect(data.groupName).toStrictEqual('mockGroupName');
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
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/v1/system/usergroups/search`, mockParams);

  await expect(getAwUserGroup(adGroupName)).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'GET',
    },
  ]);
});
