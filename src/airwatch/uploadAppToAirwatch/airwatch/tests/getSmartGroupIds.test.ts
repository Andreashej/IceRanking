import { FetchMock } from 'jest-fetch-mock';
import { getSmartGroupIds } from '../getSmartGroupIds';
import { mockAppDetails } from '../__mocks__/awAppDetails';

const fetchMock: FetchMock = global.fetch;

const searchAwSmartGroup = require('../searchAwSmartGroup');
const createAwSmartGroup = require('../createAwSmartGroup');

const adGroupName = 'adGroupName';
const bundleId = 'com.lego.corp.bundleId';
const version = '1.0.0';
const previousApps = [];
const activeApps = [];

afterEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

const previousAppsWithData = [mockAppDetails];

it('returns the smart group id when there are no previous apps', async () => {
  searchAwSmartGroup.searchAwSmartGroup = jest.fn().mockResolvedValue(1);
  const data = await getSmartGroupIds(adGroupName, bundleId, version, previousApps, activeApps);
  expect(data).toStrictEqual([1]);
});

it('returns the smart group id when there are no previous apps and no smart group', async () => {
  searchAwSmartGroup.searchAwSmartGroup = jest.fn().mockResolvedValue(undefined);
  createAwSmartGroup.createAwSmartGroup = jest.fn().mockResolvedValue(1);
  const data = await getSmartGroupIds(adGroupName, bundleId, version, previousApps, activeApps);
  expect(data).toStrictEqual([1]);
});

it('throws if the passed version exists in previousApps', async () => {
  const prevAppsWithSameVersion = [{ ...previousAppsWithData[0], AppVersion: '1.0.0' }];
  await expect(
    getSmartGroupIds(adGroupName, bundleId, version, prevAppsWithSameVersion, activeApps)
  ).rejects.toThrow(`Version "${version}" already exists in Airwatch for bundle id "${bundleId}"`);
});

it('returns the smart group ids when there are no active apps and there are previous apps', async () => {
  const data = await getSmartGroupIds(
    adGroupName,
    bundleId,
    version,
    previousAppsWithData,
    activeApps
  );
  expect(data).toStrictEqual([1]);
});

it('returns the smart group ids when there are active apps and previous apps', async () => {
  const activeAppsWithData = [...previousAppsWithData];
  const data = await getSmartGroupIds(
    adGroupName,
    bundleId,
    version,
    previousAppsWithData,
    activeApps
  );
  expect(data).toStrictEqual([1]);
});
