# react-native-scripts

A collection of scripts used for RN projects

* [APPCENTER](#appcenter)
  * [Configure Build Settings](#configure-build-settings)
* [FASTLANE](#fastlane) 
	* [Local Builds](#local-builds)
* [GITHUB](#github) 
	* [Repo Dispatch](#repo-dispatch)
* [AIRWATCH](#airwatch)
  * [Upload an app to Airwatch](#upload-an-app-to-airwatch)
* [SENTRY](#sentry)

## Installation

```bash
yarn add -E -D @lego/react-native-scripts
```

## APPCENTER

### Configure Build Settings

Sets the environment variables and other settings in in the build configuration for a branch in appcenter.ms

#### Mandatory environment variables

| Environment Variable      | Description                                                                                                                                                                                                                     | Example                                                                                            |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| APPCENTER_API_TOKEN       | information about acquiring an appcenter api token [can be found here](https://docs.microsoft.com/en-us/appcenter/api-docs/), required by appcenter openapi                                                                     | digqwlbdlet8etqwyeq6wyadhsuasudtqw7et                                                              |
| APPCENTER_APP_NAME        | the name of your app on appcenter, required by appcenter openapi, can be obtained by opening your app in appcenter.ms and extracting it from the url (appcenter.ms /orgs/{{APPCENTER_OWNER_NAME}}/apps/{{APPCENTER_APP_NAME}})  | Goods-Receipt-2.0                                                                                  |
| APPCENTER_OWNER_NAME      | the name of your team on appcenter, required by appcenter openapi, can be obtained by opening your app in appcenter.ms and extracting it from the url (appcenter.ms /orgs/{{APPCENTER_OWNER_NAME}}/apps/{{APPCENTER_APP_NAME}}) | LEGOUXMP                                                                                           |
| BUNDLE_GIT\_\_COM         | needs to be in the form of "username:github_token", not base64 encoded, required by fastlane to be able to authenticate and install react-native-ci                                                                             | gituser:12398yjhadiy1238hqwueqwgehaksjbkas                                                         |
| IOS_CERTIFICATES_GIT_URL  | the github repository url where your generated certificates and provisioning profiles are stored, required by configure-build-settings to download the certificates                                                             | add only the last part of the URL, the one after "github. com/", e.g.: "LEGO/ios-certificates.git" |
| MATCH_PASSWORD            | the passphrase you provided for encrypting the certificates and provisioning profiles, required by configure-build-settings to decrypt the certificates                                                                         | mysecretpassword                                                                                   |
| GH_TOKEN                  | A personal access token generated in GitHub with at least `read:packages` permissions. [More information here](https://help.github.com/en/github/managing-packages-with-github-packages/about-github-packages#about-tokens)     | 234yhdkjfhsdjf7ewr6wehrjkjhsduf                                                                    |
| PROJECT_OR_WORKSPACE_PATH | the path from the root folder to you .xcodeproj or .xcworkspace file, required by appcenter openapi                                                                                                                             | ios/lbrgoodsreceipt.xcworkspace                                                                    |
| XCODE_SCHEME_NAME         | the name of the scheme used for building the app, required by appcenter openapi                                                                                                                                                 | lbrgoodsreceipt                                                                                    |

It is also possible to add arbitrary environment variables by adding them to the environment with the prefix `LEGORN_`.
They will then automatically be added to the AppCenter Configuration.

#### Usage

Open package.json and add the following line to your scripts:

```javascript
"appcenter-configure-build-settings": "react-native-scripts appcenter configure-build-settings",
```

\
Next you can use it in your custom github action e.g.:

```yml
-   name:  Set AppCenter build configuration
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

> We build in 2 phases, in the first phase we execute our simple tests with github actions, in the
> second phase we build on appcenter.
>
> The functionality to skip building on github and on appcenter is not part of react-native-scripts
> as it is too opinionated, instead create a commit message using [skip-ci] or [skip-appcenter]
> for whichever scenario you see fit and use the correct github action checks to help you facilitate
> this scenario.
>
> Example:
>
> ```yml
> - name: Set AppCenter build configuration
> 	if: "!contains(github.event.head_commit.message, '[skip-appcenter]')"
> ```

By default this package uses the [Git Flow branch
configuration](https://confluence.corp.lego.com/display/UXMP/Git+Workflow) with different
environments.

|                      | Dev                                | QA                                | Prod                           |
|----------------------|------------------------------------|-----------------------------------|--------------------------------|
| Branches             | develop </br> feature/             | release/ </br> hotfix/            | master                         |
| Provisioning profile | com.lego.corp.teamName-appName-dev | com.lego.corp.teamName-appName-qa | com.lego.corp.teamName-appName |
| Env file             | .env.dev                           | .env.qa                           | .env.prod                      |

Starting with `v 0.9.5`, if you have a different
branch setup, it is possible to pass a custom configuration using

- a `legornscripts` property in `package.json`
- a `.legornscriptsrc` file in JSON or YAML format
- a `.legornscriptsrc.json` file
- a `.legornscriptsrc.yaml`, `.legornscriptsrc.yml`, or `.legornscriptsrc.js` file
- a `legornscripts.config.js` file exporting a JS object

Example:

```json
"legornscripts": {
    "branchConfig": {
        "dev": ["develop", "feature/"],
        "qa": ["release/", "bugfix/",	"hotfix/"],
        "prod": ["master"]
  }
}
```

> When creating a custom branch configuration it is important that you specify all environments with
> their corresponding branches. All branch names that are not included in the custom
> configuration will be omitted by the script.

## FASTLANE

### Local Builds

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

If you want to target a specific device or simulator, parse the name as an argument:

```javascript
"ios-device-dev":  "yarn ios-build -b Debug -e dev -d device -t iPhone",
"ios-simulator-dev":  "yarn ios-build -b Debug -e dev -d simulator -t 'iPhone Xʀ'",
```

## GITHUB

### Repo Dispatch

A script to trigger the start of a workflow that runs on `repo_dispatch`

#### Usage

Create a Github workflow file and have that workflow run on repository_dispatch:

```yaml
on:
  repository_dispatch:
    types: [eventName]
```

Trigger the workflow run by executing:

```bash
react-native-scripts github repo-dispatch eventName
```

## AIRWATCH

### Upload an app to Airwatch

A script that takes the `.ipa` file from Appcenter, uploads it to Akamai CDN and then creates a new
app in Airwatch.

#### Usage

If there is at least one previous version of the app, it retires that version and
creates a new version, assigning it to the same smart groups. There is also an option to retire all
the previous versions of the app by passing `force-publish` as the last argument when executing the
script.

If there are no previous versions of
the app, it creates a smart group for you, using the same name as the AD group name provided to the
script in the environment variables. This scenario requires to have an AD assignment group created for your app
and linked in the Airwatch Console ([more info here](https://confluence.corp.lego.com/display/UXMP/Airwatch+Group+Assignment)).

> The script must run on a machine connected to a LEGO internal network

For executing the script run

```bash
react-native-scripts airwatch upload-app
```

By default, the script retires only the latest app version. If you want to retire all previous app versions append `force-publish`:

```bash
react-native-scripts airwatch upload-app force-publish
```

By default, the script only uploads the app to Airwatch and users can request the install from the
LEGO App Store. If you want to automatically install the app to the assigned users append
`push-mode-auto` when running the script:

```bash
react-native-scripts airwatch upload-app push-mode-auto
```

#### Mandatory environment variables

| Environment Variable     | Description                                                                                                                                                                                                                     | Example                               |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| APPCENTER_API_TOKEN      | information about acquiring an appcenter api token [can be found here](https://docs.microsoft.com/en-us/appcenter/api-docs/), required by appcenter openapi                                                                     | digqwlbdlet8etqwyeq6wyadhsuasudtqw7et |
| APPCENTER_APP_NAME       | the name of your app on appcenter, required by appcenter openapi, can be obtained by opening your app in appcenter.ms and extracting it from the url (appcenter.ms /orgs/{{APPCENTER_OWNER_NAME}}/apps/{{APPCENTER_APP_NAME}})  | Goods-Receipt-2.0                     |
| APPCENTER_OWNER_NAME     | the name of your team on appcenter, required by appcenter openapi, can be obtained by opening your app in appcenter.ms and extracting it from the url (appcenter.ms /orgs/{{APPCENTER_OWNER_NAME}}/apps/{{APPCENTER_APP_NAME}}) | LEGOUXMP                              |
| GH_TOKEN                 | A personal access token generated in GitHub with at least `read:packages` permissions. [More information here](https://help.github.com/en/github/managing-packages-with-github-packages/about-github-packages#about-tokens)     | 234yhdkjfhsdjf7ewr6wehrjkjhsduf       |
| AD_GROUP                 | the name of the AD distribution group to be used with the app. [More info here](https://confluence.corp.lego.com/display/UXMP/Airwatch+Group+Assignment)                                                                        | g1.aw.sw_published_appName            |
| AW_ORGANIZATION_GROUP_ID | the organizations group id from Airwatch. Can be obtained from the Airwatch console.                                                                                                                                            | 123                                   |
| AW_TENANT_CODE           | the tenant code for publishing to Airwatch                                                                                                                                                                                      | 1ASDJH123H3148                        |
| AW_USERNAME              | the username used for Airwatch login                                                                                                                                                                                            | LEGO\dkusername                       |
| AW_PWD                   | the password used to authenticate the above username in Airwatch                                                                                                                                                                | aVerySecurePassword                   |
| PRIVATE_KEY_PASSPHRASE   | the private key passphrase for accessing Akamai CDN                                                                                                                                                                             | mySecurePassphrase                    |
| PRIVATE_KEY              | the contents of the private key file used to access Akamai CDN                                                                                                                                                                  | "-----BEGIN RSA PRIVATE KEY-----..."  |

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
