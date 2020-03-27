import { FetchMock } from 'jest-fetch-mock';
import { appendParamsToUrl, getRequest, postRequest } from './api';

const fetchMock: FetchMock = global.fetch;

const postTestUrl = 'https://some.url';
const getTestUrl = 'https://some.url/search';
const testHeaders = {
  Accept: 'application/json',
};
const testBody = {
  value1: 'test1',
  value2: 'test2',
};

const testParams = {
  param1: 'test1',
  param2: 'test2',
};

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

describe('appendParamsToUrl', () => {
  it('returns the url if no additional params are passed', () => {
    const resUrl = appendParamsToUrl(getTestUrl, testParams);
    expect(resUrl.href).toStrictEqual(`${getTestUrl}?param1=test1&param2=test2`);
  });
});

describe('post request', () => {
  it('returns data if the request is successful', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { mockData: 'test' } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    const fetchUrl = appendParamsToUrl(postTestUrl);
    const header = await postRequest(fetchUrl, testHeaders, testBody);
    expect(header.data.mockData).toStrictEqual('test');
    expect(fetchMock.mock.calls[0]).toEqual([
      fetchUrl,
      {
        headers: testHeaders,
        method: 'POST',
        body: JSON.stringify(testBody),
      },
    ]);
  });

  it('rejects if the request fails', async () => {
    fetchMock.mockRejectOnce(new Error('test'));
    const fetchUrl = appendParamsToUrl(postTestUrl);
    await expect(postRequest(fetchUrl, testHeaders, testBody)).rejects.toThrow('test');
    expect(fetchMock.mock.calls[0]).toEqual([
      fetchUrl,
      {
        headers: testHeaders,
        method: 'POST',
        body: JSON.stringify(testBody),
      },
    ]);
  });
});

describe('get request', () => {
  it('returns data if the request is successful', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { mockData: 'test' } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    const mockFetchUrl = appendParamsToUrl(getTestUrl, testParams);
    const header = await getRequest(getTestUrl, testHeaders, testParams);
    expect(header.data.mockData).toStrictEqual('test');

    expect(fetchMock.mock.calls[0][0].search).toStrictEqual('?param1=test1&param2=test2');
    expect(fetchMock.mock.calls[0]).toEqual([
      mockFetchUrl,
      {
        headers: testHeaders,
        method: 'GET',
      },
    ]);
  });

  it('rejects if the request fails', async () => {
    fetchMock.mockRejectOnce(new Error('test'));
    const mockFetchUrl = appendParamsToUrl(getTestUrl, testParams);
    await expect(getRequest(getTestUrl, testHeaders, testParams)).rejects.toThrow('test');
    expect(fetchMock.mock.calls[0][0].search).toStrictEqual('?param1=test1&param2=test2');
    expect(fetchMock.mock.calls[0]).toEqual([
      mockFetchUrl,
      {
        headers: testHeaders,
        method: 'GET',
      },
    ]);
  });
});
