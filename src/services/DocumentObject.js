// import React from 'react';
// import { Logger } from './Logger';

const getObjectField = (obj, field) => {
  const myRegexp = /^(.*)\[(.*)\]$/g;
  const match = myRegexp.exec(field);
  if (match) {
    const f = match[1];
    const index = match[2];
    return obj[f][index];
  }
  return obj[field];
};

export const objectPathExists = (object, path) => {
  if (!object) return false;
  if (!path) return true;
  const dotIndex = path.indexOf('.');
  if (dotIndex !== -1) {
    const subObjectName = dotIndex === -1 ? path : path.substring(0, dotIndex);
    const subPath = dotIndex === -1 ? '' : path.substring(dotIndex + 1);
    return objectPathExists(getObjectField(object, subObjectName), subPath);
  }
  return typeof getObjectField(object, path) !== 'undefined';
};

export const getObjectPathValue = (object, path) => {
  // Logger.of('DocumentObject.getObjectPathValue').warn('object=', object, 'path=', path);
  if (!path) return object;
  const dotIndex = path.indexOf('.');
  if (dotIndex !== -1) {
    const subObjectName = dotIndex === -1 ? path : path.substring(0, dotIndex);
    const subPath = dotIndex === -1 ? '' : path.substring(dotIndex + 1);
    return getObjectPathValue(getObjectField(object, subObjectName), subPath);
  }
  return getObjectField(object, path);
};

export const deepFind = (obj, path) => {
  if (!obj) return undefined;
  const paths = path.split('.');
  let current = obj;
  for (let i = 0; i < paths.length; i += 1) {
    // Logger.of('DocumentObject.deepFind').info('i=', i, 'current=', current, 'paths[i]=', paths[i]);
    if (typeof current[paths[i]] === 'undefined') { return undefined; }
    current = current[paths[i]];
  }
  return current;
};

export const deepSet = (obj, path, value) => {
  const paths = path.split('.');
  let current = obj;
  for (let i = 0; i < paths.length - 1; i += 1) {
    if (typeof current[paths[i]] === 'undefined') current[paths[i]] = {};
    // Logger.of('DocumentObject.deepSet').info('i=', i, 'current=', current, 'paths[i]=', paths[i], 'obj=', obj);
    current = current[paths[i]];
  }
  current[paths[paths.length - 1]] = value;
  return current;
};
