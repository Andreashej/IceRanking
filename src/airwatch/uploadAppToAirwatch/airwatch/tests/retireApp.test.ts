import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders } from '../../../../utils';
import { retireApp } from '../retireApp';
import { mockAppDetails } from '../__mocks__/awAppDetails';

const fetchMock: FetchMock = global.fetch;

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const appId = 1;

it('retires the app if the request succeeds', async () => {
  fetchMock.mockResponse(JSON.stringify({ Application: [{ ApplicationName: 'appName' }] }));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/${appId}/retire`);
  await retireApp([mockAppDetails], [mockAppDetails]);
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
    },
  ]);
});

it('throws if the request fails', async () => {
  fetchMock.mockReject(new Error('test'));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/apps/internal/${appId}/retire`);

  await expect(retireApp([mockAppDetails], [mockAppDetails])).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
    },
  ]);
});
