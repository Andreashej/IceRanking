import fetch, { Headers, Response } from 'node-fetch';

const URL = require('url').URL;

const handleApiErrors: (res: Response) => Promise<Response> = async (res) => {
  return new Promise<Response>((resolve, reject) => {
    if (res.ok || (res.status >= 200 && res.status <= 204)) {
      resolve(res);
    } else {
      res.text().then((text: string) => {
        reject(text);
      });
    }
  });
};

const appendParamsToUrl: (path: string, params?: IGenericObject) => typeof URL = (path, params) => {
  const url = new URL(path);
  if (!params) {
    return url;
  }

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  return url;
};

export type IHeaders =
  | Headers
  | string[][]
  | {
      [key: string]: string;
    };

export interface IGenericObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const getRequest: (
  uri: string,
  headers: IHeaders,
  uriParams?: IGenericObject
) => Promise<any> = (uri, headers, uriParams) => {
  return new Promise((resolve, reject) => {
    const url = appendParamsToUrl(uri, uriParams);

    const fetchParams = {
      headers,
      method: 'GET',
    };
    fetch(url, fetchParams)
      .then(handleApiErrors)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const postRequest: (
  uri: string,
  headers: IHeaders,
  body?: IGenericObject,
  uriParams?: IGenericObject
) => Promise<any> = (uri, headers, body, uriParams) => {
  return new Promise((resolve, reject) => {
    const url = appendParamsToUrl(uri, uriParams);

    const fetchParams = {
      headers,
      method: 'POST',
      body: JSON.stringify(body),
    };

    fetch(url, fetchParams)
      .then(handleApiErrors)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
