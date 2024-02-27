// @ts-nocheck
import { PHEMEX_SECRET_KEY, PHEMEX_ACCESS_KEY } from '@/config';
import axios from 'axios';
import { stringify } from 'querystring';
import { buildSignature } from './utility';
import { ApiEndpoints } from './variable';

axios.defaults.baseURL = ApiEndpoints.phemex.API_URL;

function createHeaders(urlPath, querystring = '', body = '') {
  const expiry = Math.floor(Date.now() / 1000) + 2 * 60;
  const content = urlPath + querystring + expiry + body;
  const signature = buildSignature(content, PHEMEX_SECRET_KEY);
  return {
    'Content-Type': 'application/json',
    'x-phemex-access-token': PHEMEX_ACCESS_KEY,
    'x-phemex-request-expiry': expiry,
    'x-phemex-request-signature': signature,
  };
}

export async function phemexGetRequest(url, { query } = {}) {
  try {
    const querystring = query ? stringify(query) : '';
    console.log(querystring);
    const headers = createHeaders(url, querystring);
    // console.log(headers)
    const response = await axios.get(url, {
      headers: headers,
      params: query,
      // paramsSerializer: {
      //   encode: (param: string): string => {
      //     return querystring;
      //   }, // custom encoder function; sends Key/Values in an iterative fashion
      // }
    });

    if (response.status === 200) {
      const { code, msg, data, error, result } = response.data;
      if (code === 0) {
        return { data };
      }

      if (result) {
        return { data: result };
      }

      if (error) {
        return { error };
      }

      return { error: { code, msg } };
    }
    return { error: {}, response };
  } catch (e) {
    return { error: e };
  }
}

export async function phemextPostRequest(url, { query, params }) {
  try {
    const querystring = query ? stringify(query) : '';

    const body1 = params;
    console.log(body1);
    const headers = createHeaders(url, querystring, JSON.stringify(params));
    const response = await axios.post(url, body1, {
      headers: headers,
      params: query,
      // paramsSerializer: {
      //   encode: (param: string): string => {
      //     return querystring;
      //   }, // custom encoder function; sends Key/Values in an iterative fashion
      // },
    });

    if (response.status === 200) {
      const { code, msg, data, error, result } = response.data;
      if (code === 0) {
        return { data };
      }

      if (result) {
        return { data: result };
      }

      if (error) {
        return { error };
      }

      return { error: { code, msg } };
    }
    return { error: {}, response };
  } catch (e) {
    // console.error(e);
    return { error: e };
  }
}
export async function phemextPutRequest(url, { query } = {}) {
  try {
    const querystring = query ? stringify(query) : '';
    console.log(querystring);
    const headers = createHeaders(url, querystring);
    // console.log(headers)
    const response = await axios.put(
      url,
      {},
      {
        headers: headers,
        params: query,
        // paramsSerializer: {
        //   encode: (param: string): string => {
        //     return querystring;
        //   }, // custom encoder function; sends Key/Values in an iterative fashion
        // }
      },
    );

    if (response.status === 200) {
      const { code, msg, data, error, result } = response.data;
      if (code === 0) {
        return { data };
      }

      if (result) {
        return { data: result };
      }

      if (error) {
        return { error };
      }

      return { error: { code, msg } };
    }
    return { error: {}, response };
  } catch (e) {
    return { error: e };
  }
}

export async function phemexDelRequest(url, { query } = {}) {
  try {
    const querystring = query ? stringify(query) : '';
    const headers = createHeaders(url, querystring);
    const response = await axios.delete(url, {
      headers: headers,
      params: query,
    });
    if (response.status === 200) {
      const { code, msg, data, error, result } = response.data;
      if (code === 0) {
        return { data };
      }

      if (result) {
        return { data: result };
      }

      if (error) {
        return { error };
      }

      return { error: { code, msg } };
    }
    return { error: {}, response };
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}
