#!/usr/bin/env node

import fetch from 'node-fetch';

export const repoDispatch: (eventName: string) => Promise<void> = async (eventName) => {
  try {
    const { GH_TOKEN, GITHUB_REPOSITORY } = process.env;
    if (!GH_TOKEN) {
      throw new Error('Missing GH_TOKEN env variable');
    }

    await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/dispatches`, {
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.everest-preview+json',
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      body: JSON.stringify({ event_type: eventName }),
    });
  } catch (error) {
    throw error;
  }
};
