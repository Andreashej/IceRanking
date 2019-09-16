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

| Environment Variable      | Description                                                                                                                                                                                                                     | Example                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| APPCENTER_API_TOKEN       | information about acquiring an appcenter api token [can be found here](https://docs.microsoft.com/en-us/appcenter/api-docs/), required by appcenter openapi                                                                     | digqwlbdlet8etqwyeq6wyadhsuasudtqw7et                                                              |
| APPCENTER_APP_NAME        | the name of your app on appcenter, required by appcenter openapi, can be obtained by opening your app in appcenter.ms and extracting it from the url (appcenter.ms /orgs/{{APPCENTER_OWNER_NAME}}/apps/{{APPCENTER_APP_NAME}})  | Goods-Receipt-2.0                                                                                  |
| APPCENTER_OWNER_NAME      | the name of your team on appcenter, required by appcenter openapi, can be obtained by opening your app in appcenter.ms and extracting it from the url (appcenter.ms /orgs/{{APPCENTER_OWNER_NAME}}/apps/{{APPCENTER_APP_NAME}}) | LEGOUXMP                                                                                           |
| BUNDLE_GIT\_\_COM         | needs to be in the form of "username:github_token", not base64 encoded, required by fastlane to be able to authenticate and install react-native-ci                                                                             | gituser:12398yjhadiy1238hqwueqwgehaksjbkas                                                         |
| IOS_CERTIFICATES_GIT_URL  | the github repository url where your generated certificates and provisioning profiles are stored, required by configure-build-settings to download the certificates                                                             | add only the last part of the URL, the one after "github. com/", e.g.: "LEGO/ios-certificates.git" |
| MATCH_PASSWORD            | the passphrase you provided for encrypting the certificates and provisioning profiles, required by configure-build-settings to decrypt the certificates                                                                         | mysecretpassword                                                                                   |
| NPM_AUTH_TOKEN            | provide an npm auth token if you already have one or [create one here](https://docs.npmjs.com/creating-and-viewing-authentication-tokens), required by github and appcenter to be able to install private LEGO packages         | 234yhdkjfhsdjf7ewr6wehrjkjhsduf                                                                    |
| PROJECT_OR_WORKSPACE_PATH | the path from the root folder to you .xcodeproj or .xcworkspace file, required by appcenter openapi                                                                                                                             | ios/lbrgoodsreceipt.xcworkspace                                                                    |
| XCODE_SCHEME_NAME         | the name of the scheme used for building the app, required by appcenter openapi                                                                                                                                                 | lbrgoodsreceipt                                                                                    |

#### Usage

Open package.json and add the following line to your scripts:

```javascript
"appcenter-configure-build-settings": "react-native-scripts appcenter configure-build-settings",
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

Then you can run it from your terminal

```bash
react-native-scripts fastlane local-build
```

Alternatively you can set some custom scripts in your package.json:

```javascript
"ios-build": "react-native-scripts fastlane local-build",
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

A couple of shell scripts that are used for uploading DSYM to sentry and for bundling RN code and images.

#### USAGE

It requires sentry to be setup in your project. After instaling sentry, open the ios folder and create a new file named sentry.properties with the following contents:

```javascript
defaults.url=the_base_url_where_the_logs_are_uploaded, e.g.: https://bugs.api.education.lego.com
defaults.org=the_name_of_your_organiztion, e.g.: lego-uxmp
defaults.project=the_name_of_your_project, e.g.: lbr-goods-receipt
auth.token=the_authentication_token_for_the_above_url, e.g.: 23874yihfisdfhisduf7terfgsdhwe678ryfsiub
cli.executable=path_to_sentry_cli, e.g.: node_modules/@sentry/cli/bin/sentry-cli
```

Open your app workspace in XCODE, go to targets, expand "Bundle React Native code and images" and add

```bash
../node_modules/@lego/react-native-scripts/lib/sentry/bundle-react-native-code-and-images.sh
```

Next expand "Upload Debug Symbols to Sentry" and add

```bash
../node_modules/@lego/react-native-scripts/lib/sentry/upload-debug-symbols-to-sentry.sh
```
