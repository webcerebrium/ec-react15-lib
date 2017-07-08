// import React from 'react';
// import { Logger } from './Logger';

export const objectPathExists = (object, path) => {
  if (!object) return false;
  if (!path) return true;
  const dotIndex = path.indexOf('.');
  if (dotIndex !== -1) {
    const subObjectName = dotIndex === -1 ? path : path.substring(0, dotIndex);
    const subPath = dotIndex === -1 ? '' : path.substring(dotIndex + 1);
    return objectPathExists(object[subObjectName], subPath);
  }
  return typeof object[path] !== 'undefined';
};

export const getObjectPathValue = (object, path) => {
  if (!path) return object;
  const dotIndex = path.indexOf('.');
  if (dotIndex !== -1) {
    const subObjectName = dotIndex === -1 ? path : path.substring(0, dotIndex);
    const subPath = dotIndex === -1 ? '' : path.substring(dotIndex + 1);
    return getObjectPathValue(object[subObjectName], subPath);
  }
  return object[path];
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
