import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders } from '../../../../utils';
import { awAssignSmartgroup } from '../awAssignSmartgroup';

const fetchMock: FetchMock = global.fetch;

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

it('succeeds with one smart group id', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ data: { mockData: 'test' } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/1/smartgroups/2`);
  await awAssignSmartgroup(1, [2]);
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
      body: undefined,
    },
  ]);
});

it('succeeds with multiple smart group ids', async () => {
  fetchMock.mockResponse(JSON.stringify({ data: { mockData: 'test' } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  const mockUrl1 = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/1/smartgroups/2`);
  const mockUrl2 = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/1/smartgroups/3`);

  await awAssignSmartgroup(1, [2, 3]);
  expect(fetchMock.mock.calls[0]).toHaveLength(2);
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl1,
    {
      headers: awHeaders,
      method: 'POST',
      body: undefined,
    },
  ]);

  expect(fetchMock.mock.calls[1]).toEqual([
    mockUrl2,
    {
      headers: awHeaders,
      method: 'POST',
      body: undefined,
    },
  ]);
});

it('throws if there is an error in the request', async () => {
  fetchMock.mockRejectOnce(new Error('test'));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/1/smartgroups/2`);
  await expect(awAssignSmartgroup(1, [2])).rejects.toThrow('test');
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
      body: undefined,
    },
  ]);
});
