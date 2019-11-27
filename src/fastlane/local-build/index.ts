import { execSync } from 'child_process';
import inquirer from 'inquirer';
import minimist from 'minimist';
import { printMsg } from '../../utils/printMsg';

let buildConfig: string;
let environment: string;
let destination: string;
let internal: boolean;
let gitUrl: string;
let username: string;
let target: string;

const args = minimist(process.argv, {
  alias: {
    b: 'build-type',
    d: 'destination',
    e: 'env-type',
    g: 'git-url',
    i: 'internal',
    t: 'target',
    u: 'username',
  },
  boolean: ['internal'],
  string: ['build-type', 'env-type', 'destination', 'git-url', 'username'],
});

const getArgs: () => Promise<void> = async () => {
  try {
    if (args['build-type']) {
      buildConfig =
        typeof args['build-type'] === 'object'
          ? args['build-type'][args['build-type'].length - 1]
          : args['build-type'];
    } else {
      const answer = await inquirer.prompt([
        {
          choices: ['Debug', 'Release'],
          message: 'Choose a build configuration',
          name: 'build-type',
          type: 'list',
        },
      ]);
      buildConfig = answer['build-type'];
    }

    if (args['env-type']) {
      environment = args['env-type'];
    } else {
      const answer = await inquirer.prompt([
        {
          choices: ['dev', 'qa', 'prod'],
          message: 'Choose an environment',
          name: 'env-type',
          type: 'list',
        },
      ]);
      environment = answer['env-type'];
    }

    if (args.destination) {
      destination = args.destination;
    } else {
      const answer = await inquirer.prompt([
        {
          choices: ['device', 'simulator'],
          message: 'Choose a destination for your build',
          name: 'destination',
          type: 'list',
        },
      ]);
      destination = answer.destination;
    }

    gitUrl = args['git-url'] ? args['git-url'] : 'git@github.com:LEGO/ios-certificates.git';
    username = args.username ? args.username : 'MAFBuildServer@lego.com';

    internal = args.internal;

    target = args.target;
  } catch (err) {
    throw new Error(err);
  }
};

let envFile: string;
let envType: string;

const defaultDeviceName = 'iPhone Xʀ';

export const localBuild: () => void = () => {
  getArgs()
    .then(() => {
      switch (environment) {
        case 'dev':
          envFile = internal ? '.env.dev.int' : '.env.dev';
          envType = 'debug';
          break;
        case 'prod':
          envFile = internal ? '.env.prod.int' : '.env.prod';
          envType = 'release';
          break;
        case 'qa':
          envFile = internal ? '.env.qa.int' : '.env.qa';
          envType = 'qa';
          break;
        default:
      }

      if (destination === 'device') {
        const deviceArg = target ? `--device "${target}"` : '--device';

        return execSync(
          `cd ./ios && BUILD_CONFIG=${buildConfig} ENV_TYPE=${envType} ENV_FILE=${envFile} CERT_URL=${gitUrl} APPLE_USERNAME=${username} bundle exec fastlane RUN && cd .. && react-native run-ios ${deviceArg} && cd ./ios && bundle exec fastlane RESET`,
          { stdio: 'inherit' }
        );
      }

      let simulatorName;

      // check available devices
      const simulatorListJson = execSync('xcrun simctl list --json', {
        encoding: 'utf-8',
      });

      const deviceList = JSON.parse(simulatorListJson);

      // filter off watchOS and tvOS simulators
      const simulatorKeys = Object.keys(deviceList.devices).filter(
        (key) => !key.includes('tvOS') && !key.includes('watchOS')
      );

      // put all available simulator names in a string array
      const allSimulators: string[] = simulatorKeys.reduce((simulatorArr, simulator) => {
        const devices = deviceList.devices[simulator].map((device: IDevice) => device.name);

        return simulatorArr.concat(devices);
      }, []);

      if (target) {
        const deviceExist = allSimulators.find((deviceName) => deviceName === target);
        if (deviceExist) {
          simulatorName = target;
        }
      }

      if (!simulatorName) {
        // checks for minSupportedDevice simulator as default
        const minSupportedDevice = allSimulators.find(
          (deviceName) => deviceName === defaultDeviceName
        );
        if (minSupportedDevice) {
          simulatorName = minSupportedDevice;
        } else {
          // defaults to last simulator in the list, suggestions for another default are welcome
          simulatorName = allSimulators[allSimulators.length - 1];
        }
      }

      return execSync(
        `cd ./ios && BUILD_CONFIG=${buildConfig} ENV_TYPE=${envType} ENV_FILE=${envFile} CERT_URL=${gitUrl} APPLE_USERNAME=${username} bundle exec fastlane RUN --verbose && cd .. && react-native run-ios --simulator='${simulatorName}' && cd ./ios && bundle exec fastlane RESET`,
        { stdio: 'inherit' }
      );
    })
    .catch((err) => {
      printMsg(['Oops, there was an error', err]);
    });
};

export interface IDevice {
  state: string;
  isAvailable: boolean;
  udid: string;
  name: string;
}
