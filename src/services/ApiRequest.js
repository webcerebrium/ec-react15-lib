// import fetch_ from 'isomorphic-fetch';
import { Logger } from './Logger';
/* eslint-disable no-undef, no-console */
// HACK for 'Uncaught TypeError: Illegal invocation' error in Chrome
// https://github.com/matthew-andrews/isomorphic-fetch/pull/20/files
// const fetch = fetch_.bind(undefined);
const Promise = require('es6-promise').Promise;

export const getErrorString = (response) => {
  let res = '';
  const data = response.body || response;
  if (data) {
    const level1 = ['statusText', 'statusMessage', 'errors', 'error', 'reason'];
    level1.forEach((field1) => {
      if (typeof data[field1] === 'string') {
        res = data[field1];
      } else if (data[field1] && typeof data[field1] === 'object') {
        if (data[field1].message) {
          res = data[field1].message;
        } else if (data[field1].reason) {
          res = data[field1].reason;
        }
      }
    });
  }
  return res;
};


export const DB = (ecOptions) => {
  if (typeof ecOptions.baseUrl === 'undefined') {
    Logger.of('ApiRequest.fetchOne').error('baseUrl is missing in ecOptions. Cannot Use API');
    return { fetchPreloaded: () => (Promise.reject()) };
  }
  const root = ecOptions.baseUrl;
  const getRequestHeaders = () => {
    const reqHeaders = new Headers();
    reqHeaders.append('Accept', 'application/json');
    reqHeaders.append('Content-Type', 'application/json');
    if (ecOptions.requestHeaders) { // eslint-disable-line
      Object.keys(ecOptions.requestHeaders).forEach((headerName) => {
        if (ecOptions.requestHeaders[headerName]) {
          reqHeaders.append(headerName, ecOptions.requestHeaders[headerName]);
        }
      });
    }
    // CLEAN THIS:
    if (window.AUTH_TOKEN_STORAGE) { // eslint-disable-line,
      reqHeaders.append('Authorization', localStorage.getItem(window.AUTH_TOKEN_STORAGE)); // eslint-disable-line
    }
    return reqHeaders;
  };

  const handleError = (error) => {
    const err = error;
    err.response = {
      status: 0,
      statusText:
        'Cannot connect. Please make sure you are connected to internet.'
    };
    throw error;
  };

  const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response.json().then((json) => {
      return Promise.reject({
        status: response.status,
        ok: false,
        statusText: response.statusText,
        body: json
      });
    });
  };

  const isJson = (response) => {
    return response.clone().text()
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data && typeof data === 'object') {
            return response;
          }
          return Promise.reject();
        } catch (err) {
          return Promise.reject({
            ok: false,
            status: response.status,
            statusText: 'Unexpected type response'
          });
        }
      });
  };

  const checkJson = (response) => {
    return response.clone().json()
      .then((data) => {
        const error = getErrorString(data);
        if (error) {
          return Promise.reject({
            status: response.status,
            ok: false,
            statusText: error
          });
        }
        return response;
      });
  };

  const toJson = (response) => {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.json();
  };

  const fetchRequest = (req) => {
    return (
      fetch(req)
        .catch(handleError) // handle network issues
        .then(isJson)
        .then(checkJson)
        .then(checkStatus)
        .then(toJson)
        .catch((err) => {
          const { status = '' } = err || {};
          const error = getErrorString(err);
          return ({ errors: error, statusMessage: '', status });
        })
    );
  };

  // may be: mode: 'cors', credentials: 'include', redirect: 'follow'
  const requestParams = ecOptions.requestParams || { mode: 'cors', redirect: 'follow' };
  const getPayloadParams = (object) => {
    const isFormData = object instanceof FormData;
    const headerOptions = getRequestHeaders();
    if (isFormData) {
      headerOptions.delete('Content-Type');
    }
    return {
      ...requestParams,
      headers: headerOptions,
      body: !isFormData ? JSON.stringify(object) : object };
  };
  const getSafeUrl = (url) => {
    if (typeof url === 'undefined') {
      Logger.of('ApiRequest.fetchOne').error('URL is empty, cannot be downloaded');
      return false;
    }
    return (url.indexOf('/') === 0 || url.indexOf(':') !== -1) ? url : `${root}/${url}`;
  };
  const ApiRequest = {
    fetchOne: (url) => {
      const u = getSafeUrl(url);
      if (!u) return Promise.reject();
      const req = new Request(u, { method: 'GET', ...requestParams, headers: getRequestHeaders() });
      return fetchRequest(req);
    },
    createOne: (url, object) => {
      const u = getSafeUrl(url);
      if (!u) return Promise.reject();
      const reqParams = Object.assign({ method: 'POST' }, getPayloadParams(object));
      return fetchRequest(new Request(u, reqParams));
    },
    saveOne: (url, object) => {
      const u = getSafeUrl(url);
      if (!u) return Promise.reject();
      const reqParams = Object.assign({ method: 'PUT' }, getPayloadParams(object));
      return fetchRequest(new Request(u, reqParams));
    },
    removeOne: (url) => {
      const u = getSafeUrl(url);
      if (!u) return Promise.reject();
      const reqParams = Object.assign({ method: 'DELETE', mode: 'cors', headers: getRequestHeaders() });
      return fetchRequest(new Request(u, reqParams));
    },
    send: (method, url, object) => {
      Logger.of('ApiRequest.send').info('method=', method, 'url=', url, 'object=', object);
      const u = getSafeUrl(url);
      if (!u) return Promise.reject();
      const reqParams = Object.assign({ method: method || 'POST' }, getPayloadParams(object));
      return fetchRequest(new Request(u, reqParams));
    }
  };
  // public methods
  return {
    fetchPreload: () => (
      ecOptions.preloadUrl ? ApiRequest.fetchOne(ecOptions.preloadUrl) : Promise.resolve({ rows: [] })
    ),
    fetchOne: path => (ApiRequest.fetchOne(path)),
    send: (method, url, object) => (ApiRequest.send(method, url, object))
  };
};

export default { DB };
