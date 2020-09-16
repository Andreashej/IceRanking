#!/usr/bin/env node
import { execSync } from 'child_process';
import { main } from './main';
import { logError } from './utils';

main().catch((error) => {
  logError(error);
  execSync('exit 1');
});
