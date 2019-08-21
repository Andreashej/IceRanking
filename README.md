# react-native-scripts

A collection of scripts used for RN projects

## INSTALLATION

```bash
yarn add -E @lego/react-native-scripts
```

## APPCENTER

### CONFIGURE BUILD SETTINGS

Sets the environment variables and other settings in in the build configuration for a branch in appcenter.ms

#### Mandatory environment variables

| Environment Variable      | Description                                                                                                                               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| APPCENTER_API_TOKEN       | information about acquiring an appcenter api token [can be found here](https://docs.microsoft.com/en-us/appcenter/api-docs/)              |
| APPCENTER_APP_NAME        | the name of your app on appcenter                                                                                                         |
| APPCENTER_OWNER_NAME      | the name of your team on appcenter                                                                                                        |
| BUNDLE_GIT__COM           | needs to be in the form of "username:github_token"                                                                                        |
| IOS_CERTIFICATES_GIT_URL  | the github repository url where your generated certificates and provisioning profiles are stored                                          |
| MATCH_PASSWORD            | the passphrase you provided for encrypting the certificates and provisioning profiles                                                     |
| NPM_AUTH_TOKEN            | provide an npm auth token if you already have one or [create one here](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) |
| PROJECT_OR_WORKSPACE_PATH | the path from the root folder to you .xcodeproj or .xcworkspace file                                                                      |
| XCODE_SCHEME_NAME         | the name of the scheme used for building the app                                                                                          |

#### Usage

Open package.json and add the following line to your scripts:

```javascript
"appcenter-configure-build-settings": "yarn react-native-scripts appcenter configure-build-settings",
"react-native-scripts": "react-native-scripts"
```

\
Next you can use it in your custom github action e.g.:

```javascript
-  	name:  Set AppCenter build configuration
	uses:  actions/npm@master
	env:
		APPCENTER_API_TOKEN:  ${{ secrets.APPCENTER_API_TOKEN }}
		APPCENTER_APP_NAME:  Goods-Receipt-2.0
		APPCENTER_OWNER_NAME:  LEGOUXMP
		BUNDLE_GIT__COM:  ${{ secrets.BUNDLE_GIT__COM }}
		IOS_CERTIFICATES_GIT_URL:  ${{ secrets.IOS_CERTIFICATES_GIT_URL }}
		MATCH_PASSWORD:  ${{ secrets.MATCH_PASSWORD }}
		NPM_AUTH_TOKEN:  ${{ secrets.NPM_AUTH_TOKEN }}
		PROJECT_OR_WORKSPACE_PATH:  ios/lbrgoodsreceipt.xcworkspace
		XCODE_SCHEME_NAME:  lbrgoodsreceipt
	with:
		args:  '"run appcenter-configure-build-settings"'
```

## FASTLANE

### LOCAL BUILDS

Copies the right .env files based on the build type (Debug/Release), environment type (dev/qa/production) and destination (simulator/device) and builds the app.

#### Usage

Open package.json and add the following line to your scripts:

```javascript
"react-native-scripts": "react-native-scripts"
```

Then you can run it from your terminal

```bash
yarn react-native-scripts fastlane local-build
```

Alternatively you can set some custom scripts in your package.json:

```javascript
"ios-build": "yarn react-native-scripts fastlane local-build",
"ios-device-dev":  "yarn ios-build -b Debug -e dev -d device",
"ios-device-dev-int":  "yarn ios-build -b Debug -e dev -d device -i",
"ios-device-qa":  "yarn ios-build -b Debug -e qa -d device",
"ios-device-qa-int":  "yarn ios-build -b Debug -e qa -d device -i",
"ios-device":  "yarn ios-build -b Debug -e prod -d device",
"ios-device-int":  "yarn ios-build -b Debug -e prod -d device -i",
"ios-simulator-dev":  "yarn ios-build -b Debug -e dev -d simulator",
"ios-simulator-dev-int":  "yarn ios-build -b Debug -e dev -d simulator -i",
"ios-simulator-qa":  "yarn ios-build -b Debug -e qa -d simulator",
"ios-simulator-qa-int":  "yarn ios-build -b Debug -e qa -d simulator -i",
"ios-simulator":  "yarn ios-build -b Debug -e prod -d simulator",
"ios-simulator-int":  "yarn ios-build -b Debug -e prod -d simulator -i"
```

## SENTRY

A couple of shell scripts that are used for uploading DSYM to sentry and for bundling RN code and images

#### USAGE

Open your app workspace in XCODE, go to targets, expand "Bundle React Native code and images" and add

```bash
../node_modules/@lego/react-native-scripts/lib/sentry/bundle-react-native-code-and-images.sh
```

Next expand "Upload Debug Symbols to Sentry" and add

```bash
../node_modules/@lego/react-native-scripts/lib/sentry/upload-debug-symbols-to-sentry.sh
```
