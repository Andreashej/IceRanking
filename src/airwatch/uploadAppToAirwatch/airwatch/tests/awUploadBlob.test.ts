import { appendParamsToUrl } from '../../../../services/api';
import { awBaseUrl, awHeaders, baseAkamaiFileUrl, fetchMock } from '../../../../utils';
import { awUploadBlob } from '../awUploadBlob';

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const fileName = 'fileName';

const uriParams = {
  filename: fileName,
  organizationgroupid: 593,
  filelink: `${baseAkamaiFileUrl}/${fileName}`,
  downloadfilefromlink: true,
  accessvia: 'Direct',
};

it('returns the blob id if the request is successful', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ Value: 1 }));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/blobs/uploadblob`, uriParams);
  const data = await awUploadBlob(fileName);
  expect(data).toStrictEqual(1);
  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
    },
  ]);
});

it('throws if the request fails', async () => {
  fetchMock.mockRejectOnce(new Error('test'));
  const mockUrl = appendParamsToUrl(`${awBaseUrl}/mam/blobs/uploadblob`, uriParams);

  await expect(awUploadBlob(fileName)).rejects.toThrow('test');

  expect(fetchMock.mock.calls[0]).toEqual([
    mockUrl,
    {
      headers: awHeaders,
      method: 'POST',
    },
  ]);
});
