import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders, fetchMock } from '../../../../utils';
import { createAwSmartGroup } from '../createAwSmartGroup';

const getAwUserGroup = require('../getAwUserGroup');

beforeEach(() => {
  getAwUserGroup.getAwUserGroup = jest.fn().mockResolvedValue({ id: 10 });
});
afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const adGroupName = 'adGroupName';

const mockBody = {
  Name: `AD - ${adGroupName}`,
  ManagedByOrganizationGroupId: 593,
  UserGroups: [
    {
      Id: 10,
    },
  ],
};

it('returns the smart group id if the request succeeds', async () => {
  fetchMock.mockResponse(JSON.stringify({ Value: 1 }));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mdm/smartgroups`);
  const data = await createAwSmartGroup(adGroupName);
  expect(data).toStrictEqual(1);
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
      body: JSON.stringify(mockBody),
    },
  ]);
});

it('throws if the request fails', async () => {
  fetchMock.mockRejectOnce(new Error('test'));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mdm/smartgroups`);

  await expect(createAwSmartGroup(adGroupName)).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
      body: JSON.stringify(mockBody),
    },
  ]);
});
