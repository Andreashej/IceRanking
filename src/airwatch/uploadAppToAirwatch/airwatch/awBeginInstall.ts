#!/usr/bin/env node

import { postRequest } from '../../../services/api';
import { awBaseUrl, awHeaders, awOrganizationGroupId } from '../../../utils';

export const awBeginInstall: (
  blobId: number,
  bundleId: string,
  version: string,
  appName: string
) => Promise<number> = async (blobId, bundleId, version, appName) => {
  try {
    let pushMode: 'Auto' | 'OnDemand' = 'OnDemand';
    const args = process.argv;
    if (args.some((arg) => arg === 'push-mode-auto')) {
      pushMode = 'Auto';
    }
    const body = {
      ApplicationName: appName,
      BlobId: blobId,
      DeviceType: '2',
      BundleId: bundleId,
      ActualFileVersion: version,
      LocationGroupId: awOrganizationGroupId,
      PushMode: pushMode,
      UploadViaLink: true,
      SupportedModels: {
        Model: [{ ModelName: 'iPhone' }],
      },
    };
    const data = await postRequest(`${awBaseUrl}/mam/apps/internal/begininstall`, awHeaders, body);

    return data.Id.Value;
  } catch (error) {
    throw error;
  }
};
