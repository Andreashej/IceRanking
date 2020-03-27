import { FetchMock } from 'jest-fetch-mock';
import { uploadToAirwatch } from '..';
import { IAwAppDetails } from '../../../../utils';
import { mockAppDetails } from '../__mocks__/awAppDetails';

const utilsModule = require('../../../../utils/utils');
// const getAppDetailsFromAWModule = require('../getAppDetailsFromAw');
// const getSmartGroupIdsModule = require('../getSmartGroupIds');
// const awUploadBlobModule = require('../awUploadBlob');
// const awBeginInstallModule = require('../awBeginInstall');
// const awAssignSmartgroupModule = require('../awAssignSmartgroup');

const fetchMock: FetchMock = global.fetch;
const fileName = 'fileName';
const bundleId = 'com.lego.corp.bundleid';
const appName = 'appName';
const version = '2.0.0';
const previousApps: IAwAppDetails[] = [
  { ...mockAppDetails, Status: 'Inactive' },
  { ...mockAppDetails, AppVersion: '0.0.2' },
  { ...mockAppDetails, AppVersion: '1.0.0' },
];

it('retires all the previous apps except for the one that was recently uploaded', async () => {
  utilsModule.getAppDetails = jest.fn().mockResolvedValue({ fileName, bundleId, version, appName });
  // getAppDetailsFromAWModule.getAppDetailsFromAw = jest.fn().mockResolvedValue(previousApps);
  // getSmartGroupIdsModule.getSmartGroupIds = jest.fn().mockResolvedValue([1]);
  // awUploadBlobModule.awUploadBlob = jest.fn().mockResolvedValue(123);
  // awBeginInstallModule.awBeginInstall = jest.fn().mockResolvedValue(111);
  // awAssignSmartgroupModule.awAssignSmartgroup = jest.fn().mockResolvedValue(undefined);

  fetchMock.mockResponses(
    // getAppDetailsFromAW
    [
      JSON.stringify({ Application: previousApps }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ],
    // awUploadBlob
    [
      JSON.stringify({ Value: 1 }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ],
    // awBeginInstall
    [
      JSON.stringify({ Id: { Value: 10 } }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ],
    // retireApp
    [
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ],
    // retireApp
    [
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ],
    // assignSmartGroup
    [JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }]
  );

  process.argv.push('force-publish');
  await uploadToAirwatch();

  const noOfActiveApps = previousApps.filter((app) => app.Status === 'Active').length;
  const retireAppFetchCallsAmount = fetchMock.mock.calls.filter((req) =>
    req[0].pathname.includes('retire')
  ).length;

  expect(retireAppFetchCallsAmount).toStrictEqual(noOfActiveApps);
});
