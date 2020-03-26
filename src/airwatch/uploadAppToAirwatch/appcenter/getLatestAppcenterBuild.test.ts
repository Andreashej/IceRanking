import { appendParamsToUrl } from '../../../services/api';
import {
  appcenterAppName,
  appcenterBaseUrl,
  appcenterHeaders,
  appcenterOwner,
  fetchMock,
} from '../../../utils';
import { getLatestAppcenterBuild } from './getLatestAppcenterBuild';

const mockUrl = appendParamsToUrl(
  `${appcenterBaseUrl}/${appcenterOwner}/${appcenterAppName}/branches/master/builds`
);

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

it('returns the build id if the request succeeds', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([{ id: 1 }]));
  const data = await getLatestAppcenterBuild();
  expect(data).toStrictEqual('1');
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
