import fetch, { FetchMock } from 'jest-fetch-mock';
global.fetch = fetch as FetchMock;
jest.setMock('node-fetch', fetch);
