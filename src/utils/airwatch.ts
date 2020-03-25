import chalk from 'chalk';
import dotenv from 'dotenv';
import { openSync, readdirSync } from 'fs';
import ipaExtractInfo from 'ipa-extract-info';
import { resolve as pathResolve } from 'path';

dotenv.config();

export const baseUrl = 'https://api.appcenter.ms/v0.1/apps';
export const appcenterAppName = process.env.APPCENTER_APP_NAME;
export const appcenterOwner = process.env.APPCENTER_OWNER_NAME;
export const downloadLocation = pathResolve(__dirname, '../downloads');
export const baseAkamaiFileUrl = 'https://it-mac-live-s.legocdn.com/ios';
export const privateKeyLocation = pathResolve(__dirname, '../privateKey_rsa');
export const awBaseUrl = 'https://awconsole.corp.lego.com/API';

export const appcenterHeaders = {
  Accept: 'application/json',
  'X-API-Token': process.env.APPCENTER_API_TOKEN || '',
};

const awAuth = `Basic ${Buffer.from(
  `${process.env.AW_USERNAME || ''}:${process.env.AW_PWD || ''}`
).toString('base64')}`;

export const awHeaders = {
  'aw-tenant-code': process.env.AW_TENANT_CODE || '',
  Accept: 'application/json',
  Authorization: awAuth,
};

export const getAppDetails: () => Promise<{
  bundleId: string;
  version: string;
  fileName: string;
  appName: string;
}> = () => {
  return new Promise((resolve, reject) => {
    const fileName = readdirSync(`${downloadLocation}/build`)[0];

    const ipaFile = openSync(`${downloadLocation}/build/${fileName}`, 'r');
    ipaExtractInfo(ipaFile, (err: Error, ipaInfo: IIpaInfo[]) => {
      if (err) {
        reject(err);
      }
      const { CFBundleIdentifier, CFBundleShortVersionString, CFBundleDisplayName } = ipaInfo[0];
      resolve({
        bundleId: CFBundleIdentifier,
        version: CFBundleShortVersionString,
        fileName,
        appName: CFBundleDisplayName,
      });
    });
  });
};

export const promiseTimeout: (delay: number) => Promise<void> = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

export const logError: (text: string | string[]) => void = (text) => {
  // eslint-disable-next-line no-console
  console.log(chalk.bold.red(text));
};

export const logSuccess: (text: string | string[]) => void = (text) => {
  // eslint-disable-next-line no-console
  console.log(chalk.green(text));
};

export const logInfo: (text: string | string[]) => void = (text) => {
  // eslint-disable-next-line no-console
  console.log(chalk.blue(text));
};

export interface IAwAppDetails {
  ApplicationName: string;
  BundleId: string;
  AppVersion: string;
  ActualFileVersion: string;
  AppType: string;
  Status: string;
  Platform: number;
  SupportedModels: { Model: any[] };
  AssignmentStatus: string;
  ApplicationSize: string;
  CategoryList: { Category: any[] };
  SmartGroups: ISmartGroup[];
  IsReimbursable: boolean;
  ApplicationSource: number;
  LocationGroupId: number;
  RootLocationGroupName: string;
  LargeIconUri: string;
  MediumIconUri: string;
  SmallIconUri: string;
  PushMode: number;
  AppRank: number;
  AssignedDeviceCount: number;
  InstalledDeviceCount: number;
  NotInstalledDeviceCount: number;
  AutoUpdateVersion: boolean;
  EnableProvisioning: boolean;
  IsDependencyFile: boolean;
  ContentGatewayId: number;
  IconFileName: string;
  ApplicationFileName: string;
  MetadataFileName: string;
  Id: { Value: number };
  Uuid: string;
}

export interface ISmartGroup {
  Id: number;
  Name: string;
}

export interface IIpaInfo {
  CFBundleName: string;
  DTSDKName: string;
  DTXcode: string;
  UILaunchStoryboardName: string;
  DTSDKBuild: string;
  CFBundleDevelopmentRegion: string;
  CFBundleVersion: string;
  BuildMachineOSBuild: string;
  DTPlatformName: string;
  CFBundlePackageType: string;
  CFBundleShortVersionString: string;
  CFBundleSupportedPlatforms: string[];
  NSAppTransportSecurity: { NSAllowsArbitraryLoads: boolean; NSExceptionDomains: any[] };
  CFBundleInfoDictionaryVersion: string;
  CFBundleExecutable: string;
  DTCompiler: string;
  UIRequiredDeviceCapabilities: string[];
  MinimumOSVersion: string;
  CFBundleIdentifier: string;
  UIAppFonts: string[];
  CFBundleSignature: string;
  DTPlatformVersion: string;
  CFBundleDisplayName: string;
  DTXcodeBuild: string;
  LSRequiresIPhoneOS: boolean;
  UIDeviceFamily: number[];
  UISupportedInterfaceOrientations: string[];
  UIViewControllerBasedStatusBarAppearance: boolean;
  DTPlatformBuild: string;
  NSLocationWhenInUseUsageDescription: string;
  DTAppStoreToolsBuild: string;
}

export interface IAwUserGroup {
  groupName: string;
  type: string;
  lastSyncOn: string;
  rootLocationGroupName: string;
  syncStatus: string;
  mergeStatus: string;
  users: number;
  id: number;
}
