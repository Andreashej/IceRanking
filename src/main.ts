#!/usr/bin/env node
import { execSync } from 'child_process';
import { cosmiconfig } from 'cosmiconfig';
import flattenDeep from 'lodash.flattendeep';
import minimist from 'minimist';
import { join } from 'path';
import { uploadAppToAirwatch } from './airwatch';
import { setBuildConfiguration } from './appcenter';
import { localBuild } from './fastlane';
import { repoDispatch } from './github/repoDispatch';
import { currentBranchIsWhitelisted, logError, logInfo, logWarning } from './utils';

const args = minimist(process.argv.slice(2));

const target = args._[0];
const action = args._[1];
const ghDispatchAction = args._[2];

export enum EnvType {
  dev = 'dev',
  qa = 'qa',
  prod = 'prod',
}
type IBranchConfig = { [key in EnvType]: string[] };

const currentBranchName = process.env.GITHUB_REF?.split('refs/heads/')[1]?.toLowerCase();

// use this name for cosmiconfig (https://github.com/davidtheclark/cosmiconfig)
const moduleName = 'legornscripts';
const configExplorer = cosmiconfig(moduleName);

// the default branch configuration for each environment
let branchConfig: IBranchConfig = {
  qa: ['release/', 'hotfix/'],
  prod: ['master'],
  dev: ['develop', 'feature/'],
};

// check if there is a custom configuration defined in the project for RNScripts
// if a custom config is found, parse the object and return an array of all the branches that should
// be built in appcenter and an environment for the build
const getCustomConfig: () => Promise<{
  whitelistedBranches: string[];
  env: EnvType | undefined;
}> = async () => {
  try {
    const configResult = await configExplorer.search(moduleName);
    if (!configResult) {
      logInfo('no custom configuration found, using default config');
    }
    if (configResult?.config?.branchConfig) {
      branchConfig = configResult.config.branchConfig;
    }
    //list of all branches that can should be built in appcenter
    const whitelistedBranches = flattenDeep(Object.values(branchConfig));
    let env: EnvType | undefined;
    // parse the branch configuration and extract the environment
    Object.keys(branchConfig).forEach((key) => {
      const objectKey = key as EnvType;
      if (
        currentBranchName &&
        branchConfig[objectKey].some((branchName: string) =>
          currentBranchName.startsWith(branchName)
        )
      ) {
        env = objectKey;
      }
    });

    return { whitelistedBranches, env };
  } catch (error) {
    throw error;
  }
};

const execAppcenter: () => Promise<void> = async () => {
  try {
    const { env, whitelistedBranches } = await getCustomConfig();

    switch (action) {
      case 'configure-build-settings':
        if (!env) {
          logError('no environment matches your current branch');
          break;
        }
        setBuildConfiguration(env);
        break;
      case 'report-build-status':
        if (currentBranchIsWhitelisted(whitelistedBranches, currentBranchName)) {
          execSync(join(__dirname, './appcenter/report-build-status/report-build-status.sh'), {
            stdio: 'inherit',
          });
        } else {
          logWarning(
            'We only want whitelisted git flow branches building in appcenter. For more information regarding the default branch configuration visit https://confluence.corp.lego.com/display/UXMP/Git+Workflow. You can also create a custom configuration file (see the documentation at https://github.com/LEGO/react-native-scripts)'
          );
        }

        break;
      default:
        logError('no action found in appcenter that matches your arguments');
    }
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const main: () => void = () => {
  switch (target) {
    case 'appcenter':
      execAppcenter();
      break;
    case 'fastlane':
      switch (action) {
        case 'local-build':
          localBuild();
          break;
        default:
          logError('no action found in fastlane that matches your arguments');
      }
      break;
    case 'sentry':
      switch (action) {
        default:
          logError(`"${action}" not available for sentry`);
      }
      break;
    case 'github':
      switch (action) {
        case 'repo-dispatch':
          repoDispatch(ghDispatchAction);
          break;
        default:
          logError(`"${action}" not available for github`);
      }
      break;
    case 'airwatch':
      switch (action) {
        case 'upload-app':
          uploadAppToAirwatch();
          break;
        default:
      }
      break;
    default:
      logError(`${target} not found, valid options are appcenter, fastlane, github or airwatch`);
  }
};
