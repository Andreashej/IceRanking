import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl } from '../../../services/api';
import {
  appcenterAppName,
  appcenterBaseUrl,
  appcenterHeaders,
  appcenterOwner,
} from '../../../utils';
import { getLatestAppcenterBuild } from './getLatestAppcenterBuild';

const fetchMock: FetchMock = global.fetch;

const mockUrl = appendParamsToUrl(
  `${appcenterBaseUrl}/${appcenterOwner}/${appcenterAppName}/branches/master/builds`
);

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

it('returns the build id if the request succeeds', async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify([
      { id: 1, status: 'completed', result: 'failed' },
      { id: 2, status: 'inProgress' },
      { id: 3, status: 'completed', result: 'succeeded' },
    ]),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  );
  const data = await getLatestAppcenterBuild();
  expect(data).toStrictEqual('3');
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: appcenterHeaders,
      method: 'GET',
    },
  ]);
});

it('throws if the request fails', async () => {
  fetchMock.mockRejectOnce(new Error('test'));

  await expect(getLatestAppcenterBuild()).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: appcenterHeaders,
      method: 'GET',
    },
  ]);
});
