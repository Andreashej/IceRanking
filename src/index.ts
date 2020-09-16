#!/usr/bin/env node
import { setFailed as ghSetFailed } from '@actions/core';
import { main } from './main';

main().catch((error) => {
  ghSetFailed(error);
});
