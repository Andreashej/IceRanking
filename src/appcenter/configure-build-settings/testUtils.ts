export const expectedBody = JSON.stringify({
  environmentVariables: [
    {
      isSecret: true,
      name: 'GH_TOKEN',
      value: 'ghAuthToken',
    },
    {
      isSecret: true,
      name: 'BUNDLE_GIT__COM',
      value: 'bundleGitCom',
    },
    {
      isSecret: false,
      name: 'APPCENTER_OWNER_NAME',
      value: 'appcenterOwnerName',
    },
    {
      isSecret: false,
      name: 'APPCENTER_APP_NAME',
      value: 'appcenterAppName',
    },
    {
      isSecret: true,
      name: 'APPCENTER_API_TOKEN',
      value: 'appcenterApiToken',
    },
    {
      isSecret: true,
      name: 'SENTRY_AUTH_TOKEN',
      value: 'sentryAuthToken',
    },
  ],
  signed: true,
  toolsets: {
    buildscripts: {
      'package.json': {},
    },
    javascript: {
      nodeVersion: '12.x',
      packageJsonPath: 'package.json',
      runTests: false,
    },
    xcode: {
      appExtensionProvisioningProfileFiles: [],
      certificateEncoded: 'certEncoded',
      certificateFilename: 'certFilename',
      certificatePassword: 'matchPassword',
      xcodeVersion: '12.1',
      projectOrWorkspacePath: 'projectOrWorkspacePath',
      provisioningProfileEncoded: 'profileEncoded',
      provisioningProfileFilename: 'provisioningProfileFilename',
      scheme: 'xcodeSchemeName',
    },
  },
  trigger: 'manual',
});
