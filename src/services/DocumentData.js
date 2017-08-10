import { Logger } from './Logger';
import { deepFind, deepSet, objectPathExists, getObjectPathValue } from './DocumentObject';

export const getCompositeValue = (value, props, context) => {
  // Logger.of('getCompositeValue').info('dataSource=', dataSource);
  const nextParamStart = value.indexOf('{{');
  const nextParamEnd = value.indexOf('}}');
  if (nextParamStart !== -1 && nextParamEnd !== -1) {
    // blacklisting to prevent render before .row load
    if (!context.row && value.indexOf('{{row:') !== -1) { return ''; }
    const nextParam = value.substring(nextParamStart + 2, nextParamEnd).trim();
    const propsCopy = Object.assign({}, props, { '@dataTemp': nextParam });
    /* eslint-disable no-use-before-define */
    const nextParamValue = getValue(propsCopy, 'dataTemp', context, '');
    /* eslint-enable no-use-before-define */
    const result = value.substring(0, nextParamStart) + nextParamValue + value.substring(nextParamEnd + 2);
    Logger.of('DocumentData.getCompositeValue').info('nextParams=', nextParam,
      'nextParamValue=', nextParamValue, 'result=', result);
    return getCompositeValue(result, props, context);
  }
  return value;
};

export const setValue = (target, value, context = {}) => {
  /* eslint-disable no-undef */
  if (target.indexOf('ls:') === 0) {
    const f = target.substring(3).trim();
    localStorage.setItem(f, typeof value === 'object' ? JSON.stringify(value) : value);
    Logger.of('DocumentData.setValue').info('localStorage value was set', f, '=', value,
      're-reading', localStorage.getItem(f));
  } else if (target.indexOf('ss:') === 0) {
    const f = target.substring(3).trim();
    sessionStorage.setItem(f, typeof value === 'object' ? JSON.stringify(value) : value);
    Logger.of('DocumentData.setValue').info('sessionStorage value was set', f, '=', value,
      're-reading', sessionStorage.getItem(f));
  } else if (target.indexOf('g:') === 0) {
    const f = target.substring(2).trim();
    if (typeof context.onSet === 'function') {
      context.onSet(f, value);
      Logger.of('DocumentData.setValue').info('global variable  value was set', f, '=', value);
    } else {
      Logger.of('DocumentData.setValueG').warn('global variable cannot be set, missing onSet field=',
        f, ' value=', value, 'context=', context);
    }
  } else if (target.indexOf(':') !== -1) {
    const streamName = target.substring(0, target.indexOf(':'));
    if (typeof context[streamName] !== 'undefined') {
      const f = target.substring(streamName.length + 1).trim();
      Logger.of('DocumentData.setValue.custom').warn('streamName', streamName, 'context=', context);
      deepSet(context[streamName], f, value);
    } else {
      Logger.of('DocumentData.setValue.custom').warn('invalid stream', streamName, 'context=', context);
    }
  } else {
    Logger.of('DocumentData.setValue').warn('invalid data target', target);
  }
  /* eslint-enable no-undef */
};

const getPersistentValue = (val) => {
  if (!val) return '';
  if (val.substring(0, 1) === '{' || val.substring(0, 1) === '[') return JSON.parse(val);
  if (val === 'null' || val === 'undefined') return '';
  return val;
};

export const getWritableValue = (dataSource, context = {}, defaultValue = '') => {
  /* eslint-disable no-undef */
  // LS: - data from the localStorage
  if (dataSource.indexOf('ls:') === 0) {
    const f = dataSource.substring(3).trim();
    if (typeof localStorage[f] === 'undefined') {
      // these values are typically not found, no sense in warning
      Logger.of('DocumentData.getValue.localStorage').info('value not found in localStorage, using default for', f);
      return defaultValue;
    }
    const value = localStorage.getItem(f);
    Logger.of('DocumentData.getValue.localStorage').info('LocalStorage: reading', f, 'value=', value);
    return getPersistentValue(value);
  }
  // SS: - data from the sessionStorage
  if (dataSource.indexOf('ss:') === 0) {
    const f = dataSource.substring(3).trim();
    if (typeof sessionStorage[f] === 'undefined') {
      // these values are typically not found, no sense in warning
      Logger.of('DocumentData.getValue.sessionStorage').info('value not found in sessionStorage, using default for', f);
      return defaultValue;
    }
    const value = sessionStorage.getItem(f);
    Logger.of('DocumentData.getValue.sessionStorage').info('SessionStorage: reading', f, 'value=', value);
    return getPersistentValue(value);
  }
  if (dataSource.indexOf('g:') === 0) {
    if (typeof context.globals !== 'undefined') {
      const f = dataSource.substring(2).trim();
      if (f.indexOf('.') !== -1) {
        const found = deepFind(context.globals, f);
        // Logger.of('getValue.globals').info('getValue of field=', f, 'value=', found);
        return found;
      }
      return context.globals[f];
    }
    Logger.of('DocumentData.getValue.globals')
      .warn('global variable cannot be get, invalid context. dataSource=', dataSource, 'context=', context);
    return defaultValue;
  }
  if (dataSource.indexOf(':') !== -1) {
    const streamName = dataSource.substring(0, dataSource.indexOf(':'));
    if (typeof context[streamName] !== 'undefined') {
      const f = dataSource.substring(streamName.length + 1).trim();
      if (f.indexOf('.') !== -1) {
        const found = deepFind(context[streamName], f);
        return found;
      }
      return context[streamName][f];
    }
    Logger.of('DocumentData.getValue.globals').warn('invalid stream. please check semicolon presense',
        streamName, 'context=', context);
    return defaultValue;
  }
  /* eslint-enable no-undef */
  return false;
};

export const getValue = (props, field, context, defaultValue = '') => {
  const dataSource = props[`@${field}`];
  const info = Logger.of('DocumentData.getValue').info;
  const warn = typeof jest !== 'undefined' ?
    Logger.of('DocumentData.getValue').warn :
    Logger.of('DocumentData.getValue').info;
  if (dataSource) {
    //if (dataSource === 'value') {
    //  return context.value;
    //}
    if (dataSource.indexOf(':') === -1) {
      const foundInContext = deepFind(context, dataSource);
      if (typeof foundInContext !== 'undefined') {
        return foundInContext;
      }
      const foundInProps = deepFind(props, dataSource);
      if (typeof foundInProps !== 'undefined') {
        return foundInProps;
      }
      warn('expected data source before colon', dataSource, 'props', props, 'context', context);
      return defaultValue;
    }
    if (dataSource.indexOf('{{') !== -1) {
      return getCompositeValue(dataSource, props, context, defaultValue);
    }
    // ROW: - data came from the parent container
    if (dataSource.indexOf('row:') === 0) {
      const f = dataSource.substring(4).trim();
      if (!context.row) {
        warn('expected row to be binded', dataSource, 'context', context);
        return defaultValue;
      }
      if (!objectPathExists(context.row, f)) {
        warn('expected data in row object', f, 'context.row=', context.row);
        return defaultValue;
      }
      const value = getObjectPathValue(context.row, f);
      info('row storage: reading', f, 'value=', value);
      return value;
    }
    // Location: - data came from location object (useful for integration)
    if (dataSource.indexOf('location:') === 0) {
      const f = dataSource.substring('location:'.length).trim();
      const value = getObjectPathValue(location, f); // eslint-disable-line no-undef
      info('Templates location: reading', f, 'value=', value);
      return value;
    }
    // TPL: - data came from loadedData section in the Template.
    // Might be deprecated - no reasons not to use globals instead
    if (dataSource.indexOf('tpl:') === 0) {
      const f = dataSource.substring(4).trim();
      const value = context.loadedData ? context.loadedData[f] : defaultValue;
      info('Templates loadedData: reading', f, 'value=', value);
      return value;
    }
    // DOC: - data came from database documents (proable describled in templates loadedDoc)
    if (dataSource.indexOf('doc:') === 0) {
      const fullPath = dataSource.substring('doc:'.length).trim();
      const dotIndex = fullPath.indexOf('.');
      const documentIndex = dotIndex === -1 ? fullPath : fullPath.substring(0, dotIndex);
      const documentPath = dotIndex === -1 ? '' : fullPath.substring(dotIndex + 1);
      info('reading document=', documentIndex, 'documentPath=', documentPath, 'context=', context);
      if (typeof context.docs === 'undefined') {
        warn('context.docs are not setup, while searching for document documentIndex=', documentIndex);
        return defaultValue;
      }
      if (typeof context.docs[documentIndex] === 'undefined') {
        // Logger.of('DocumentData.getValue.doc').warn('expected document to be binded documentIndex=', documentIndex);
        return defaultValue;
      }
      const doc = context.docs[documentIndex];
      const found = objectPathExists(doc, documentPath);
      const value = found ? getObjectPathValue(doc, documentPath) : defaultValue;
      if (!found) {
        warn('expected document path documentIndex=', documentIndex, 'path=', documentPath);
      } else {
        info('value=', documentIndex, documentPath, '=', value);
      }
      return value;
    }
    // QUERY: - data came from database documents (proable describled in templates loadedDoc)
    if (dataSource.indexOf('query:') === 0) {
      const fullPath = dataSource.substring('query:'.length).trim();
      const dotIndex = fullPath.indexOf('.');
      const documentIndex = dotIndex === -1 ? fullPath : fullPath.substring(0, dotIndex);
      const documentPath = dotIndex === -1 ? '' : fullPath.substring(dotIndex + 1);
      info('loadedQueries: reading query=', documentIndex, 'documentPath=', documentPath, 'context=', context);
      if (typeof context.queries[documentIndex] === 'undefined') {
        info('expected query to be binded queryIndex=', documentIndex);
        return defaultValue;
      }
      const doc = context.queries[documentIndex];
      const found = (objectPathExists(doc, documentPath));
      const value = found ? getObjectPathValue(doc, documentPath) : defaultValue;
      if (!found) {
        warn('expected document path queryIndex=', documentIndex, documentPath);
      } else {
        info('found value for', documentIndex, documentPath, '=', value);
      }
      return value;
    }
    const writableValue = getWritableValue(dataSource, context, '');
    if (writableValue !== false) return writableValue;
  }
  return (typeof props[field] === 'undefined') ? defaultValue : props[field];
};

export const getReadableValue = (dataSource, context, defaultValue = '') => {
  const props = {};
  props['@tempVar'] = dataSource;
  return getValue(props, 'tempVar', context, defaultValue);
};

export const getEvaluated = (props, context) => {
  if (!props) return {};
  const result = {};
  Object.keys(props).forEach((key) => {
    if (key.substring(0, 1) === '@') {
      result[key.substring(1)] = getValue(props, key.substring(1), context);
    } else {
      result[key] = props[key];
    }
  });
  return result;
};

export default { setValue, getValue, getEvaluated, getWritableValue, getReadableValue, getCompositeValue };
