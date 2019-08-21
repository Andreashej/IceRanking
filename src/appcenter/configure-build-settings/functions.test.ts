import { FetchMock } from 'jest-fetch-mock';
import { setBranchConfig } from './functions';
import { expectedBody } from './testUtils';

const fetchMock: FetchMock = global.fetch;

afterEach(() => {
  fetchMock.resetMocks();
});

describe('setBranchConfig', () => {
  it('should be able to set the branch configuration', async () => {
    fetchMock.mockResponse(JSON.stringify({ success: true }), {
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
    });
    expect.assertions(2);
    const response = await setBranchConfig(
      'certEncoded',
      'certFilename',
      'profileEncoded',
      'provisioningProfileFilename',
      'POST'
    );
    expect(response).toStrictEqual({ success: true });

    expect(fetchMock.mock.calls[0]).toEqual([
      'https://api.appcenter.ms/v0.1/apps/appcenterOwnerName/appcenterAppName/branches/master/config',
      {
        body: expectedBody,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Token': 'appcenterApiToken',
        },
        method: 'POST',
      },
    ]);
  });

  it('should reject if there is an error', async () => {
    fetchMock.mockReject(new Error('error'));
    expect.assertions(3);
    try {
      await setBranchConfig(
        'certEncoded',
        'certFilename',
        'profileEncoded',
        'provisioningProfileFilename',
        'PUT'
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toStrictEqual('error');

      expect(fetchMock.mock.calls[0]).toEqual([
        'https://api.appcenter.ms/v0.1/apps/appcenterOwnerName/appcenterAppName/branches/master/config',
        {
          body: expectedBody,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Token': 'appcenterApiToken',
          },
          method: 'PUT',
        },
      ]);
    }
  });
});
