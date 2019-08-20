export const expectedBody = JSON.stringify({
  environmentVariables: [
    {
      isSecret: true,
      name: 'NPM_AUTH_TOKEN',
      value: 'npmAuthToken',
    },
    {
      isSecret: true,
      name: 'BUNDLE_GIT__COM',
      value: 'bundleGitCom',
    },
  ],
  signed: true,
  toolsets: {
    buildscripts: {
      'package.json': {},
    },
    javascript: {
      nodeVersion: '8.x',
      packageJsonPath: 'package.json',
      runTests: false,
    },
    xcode: {
      appExtensionProvisioningProfileFiles: [],
      certificateEncoded: 'certEncoded',
      certificateFilename: 'certFilename',
      certificatePassword: 'matchPassword',
      forceLegacyBuildSystem: true,
      projectOrWorkspacePath: 'projectOrWorkspacePath',
      provisioningProfileEncoded: 'profileEncoded',
      provisioningProfileFilename: 'provisioningProfileFilename',
      scheme: 'xcodeSchemeName',
    },
  },
  trigger: 'manual',
});
