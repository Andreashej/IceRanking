const defaultBody = {
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
  },
  trigger: 'manual',
};

const defaultXcode = {
  appExtensionProvisioningProfileFiles: [],
  certificateEncoded: 'certEncoded',
  certificateFilename: 'certFilename',
  certificatePassword: 'matchPassword',
  xcodeVersion: '12.1',
  projectOrWorkspacePath: 'projectOrWorkspacePath',
  provisioningProfileEncoded: 'profileEncoded',
  provisioningProfileFilename: 'provisioningProfileFilename',
  scheme: 'xcodeSchemeName',
};

const defaultAndroid = {
  gradleWrapperPath: 'android/gradlew',
  module: 'app',
  buildVariant: 'release',
  runTests: false,
  runLint: false,
  isRoot: true,
  automaticSigning: true,
  keystorePassword: 'keyStorePassword',
  keyAlias: 'keyAlias',
  keyPassword: 'keyPassword',
};

export const expectedBodyXcode = JSON.stringify({
  ...defaultBody,
  toolsets: {
    ...defaultBody.toolsets,
    xcode: defaultXcode,
  },
});

export const expectedBodyAndroid = JSON.stringify({
  ...defaultBody,
  toolsets: {
    ...defaultBody.toolsets,
    android: defaultAndroid,
  },
});
