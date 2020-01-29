import { FetchMock } from 'jest-fetch-mock';
import { setBranchConfig } from './functions';
import { expectedBody } from './testUtils';

const fetchMock: FetchMock = global.fetch;
const currentBranchName = decodeURIComponent(process.env.GITHUB_REF?.split('refs/heads/')[1]);

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
      `https://api.appcenter.ms/v0.1/apps/appcenterOwnerName/appcenterAppName/branches/${currentBranchName}/config`,
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
    await expect(
      setBranchConfig(
        'certEncoded',
        'certFilename',
        'profileEncoded',
        'provisioningProfileFilename',
        'PUT'
      )
    ).rejects.toThrow('error');
    expect(fetchMock.mock.calls[0]).toEqual([
      `https://api.appcenter.ms/v0.1/apps/appcenterOwnerName/appcenterAppName/branches/${currentBranchName}/config`,
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
  });
});
