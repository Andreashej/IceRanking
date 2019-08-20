import { execSync } from 'child_process';
import inquirer from 'inquirer';
import minimist from 'minimist';

let buildConfig: string;
let environment: string;
let destination: string;
let internal: boolean;

const args = minimist(process.argv, {
  alias: {
    b: 'build-type',
    d: 'destination',
    e: 'env-type',
    i: 'internal',
  },
  boolean: ['internal'],
  string: ['build-type', 'env-type', 'destination'],
});

const getArgs = async () => {
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

    internal = args.internal;
  } catch (err) {
    throw new Error(err);
  }
};

let envFile: string;
let envType: string;

export const localBuild = async () => {
  getArgs()
    .then(async () => {
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
        return execSync(
          `cd ./ios && BUILD_CONFIG=${buildConfig} ENV_TYPE=${envType} ENV_FILE=${envFile} bundle exec fastlane RUN && cd .. && react-native run-ios --device && cd ./ios && bundle exec fastlane RESET`,
          { stdio: 'inherit' }
        );
      }

      return execSync(
        `cd ./ios && BUILD_CONFIG=${buildConfig} ENV_TYPE=${envType} ENV_FILE=${envFile} bundle exec fastlane RUN --verbose && cd .. && react-native run-ios --simulator='iPhone 6' && cd ./ios && bundle exec fastlane RESET`,
        { stdio: 'inherit' }
      );
    })
    .catch((err) => {
      // tslint:disable-next-line:no-console
      console.log('Oops, there was an error', err);
    });
};
