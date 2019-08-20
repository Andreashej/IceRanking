#!/usr/bin/env node
import minimist from 'minimist';
import { setBuildConfiguration } from './appcenter';
import { localBuild } from './fastlane';

const args = minimist(process.argv.slice(2));
console.log('args: ', args);

const target = args._[0];
const action = args._[1];

switch (target) {
  case 'appcenter':
    switch (action) {
      case 'configure-build-settings':
        setBuildConfiguration();
        break;
      default:
        console.log('no action found in appcenter that matches your arguments');
    }
    break;
  case 'fastlane':
    switch (action) {
      case 'local-build':
        localBuild();
        break;
      default:
        console.log('no action found in fastlane that matches your arguments');
    }
    break;
  case 'sentry':
    switch (action) {
      default:
        console.log('no action found in sentry that matches your arguments');
    }
    break;
  default:
    console.log('no valid target found');
}
