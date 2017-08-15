import { Logger } from './Logger';
import { DB } from './ApiRequest';
import { getValue, setValue } from './DocumentData';
import { conditionalSet } from './DocumentCondition';
import { getDocumentContext } from './TplContext';

/* eslint-disable no-useless-escape */
const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const routePathValues = (path, routePath) => {
  const hasMask = routePath.indexOf('*') !== -1;
  if (hasMask) {
    // the case when routepath has some mask, replace the mask into regex,
    // then test path with that regex
    let regexTpl = escapeRegExp(routePath);
    regexTpl = replaceAll(regexTpl, '\\*\\*', '(.+)');
    regexTpl = replaceAll(regexTpl, '\\*', '([^/]+)');
    // Logger.of('routePath').info(routePath, 'regex=', regexTpl);
    const regex = new RegExp(regexTpl);
    Logger.of('TplRoute.routePathValues').info('regex', regex);
    const result = [];
    const arr = regex.exec(path);
    for (let i = 1; i < arr.length; i += 1) { result.push(arr[i]); }
    return result;
  }
  Logger.of('TplRoute.routePathValues').warn('Route has no masks, nothing to map');
  return false;
};

const initChunks = (list, dispatch) => {
  Object.keys(list).forEach((docIndex) => {
    if (list[docIndex].chunks) {
      dispatch({ type: 'INIT_DATA_QUERY_CHUNKS', payload: [docIndex, list[docIndex].chunks] });
    }
  });
};

const enqueueDataStream = (queue, list, context, actionType) => {
  if (list) {
    Logger.of('TplRouteData.enqueueDataStream').info('list=', list);
    Object.keys(list).forEach((docIndex) => {
      const url2Load = getValue(list[docIndex], 'url', context);
      const alreadyInQueue = queue.find(q => (q.url === url2Load));
      if (!url2Load) {
        Logger.of('TplRouteData.enqueueDataStream').warn('url2Load is not found', list[docIndex]);
      } else if (alreadyInQueue) {
        Logger.of('TplRouteData.enqueueDataStream').warn('url2Load is attempted to be loaded twice', url2Load);
      } else {
        queue.push({ ...list[docIndex], actionType, docIndex, url: url2Load });
      }
    });
  }
};

const downloadAllSyncData = (ecOptions, dispatch, queue, callback) => {
  if (queue.length === 0) {
    callback();
  } else {
    const { actionType, docIndex, url } = queue.shift();
    Logger.of('TplRouteData.downloadAllSyncData').info('sync url=', url);
    dispatch({ type: 'WAIT_FOR_DATA' });
    DB(ecOptions).fetchOne(url).then((data) => {
      dispatch({ type: actionType, payload: [docIndex, data] });
      downloadAllSyncData(ecOptions, dispatch, queue, callback);
    });
  }
};

const downloadAllAsyncData = (ecOptions, dispatch, queueAsync) => {
  queueAsync.forEach((queue) => {
    const { actionType, docIndex, url } = queue;
    Logger.of('TplRouteData.downloadAllAsyncData').info('start async url=', url);
    DB(ecOptions).fetchOne(url).then((data) => {
      dispatch({ type: actionType, payload: [docIndex, data] });
    });
  });
};

export const downloadTemplateData = ({ route, tpl, store, callback }) => {
  const { dispatch } = store;
  const ecOptions = store.getState().globals.ecOptions;
  if (tpl && tpl.if) {
    conditionalSet(tpl, getDocumentContext(store.getState()));
  }
  if (tpl && tpl.loadedData) {
    Object.keys(tpl.loadedData).forEach((k) => {
      dispatch({ type: 'SET_DATA', payload: [k, tpl.loadedData[k]] }); // todo: setValue instead
    });
  }
  if (route && route.loadedData) {
    Object.keys(route.loadedData).forEach((k) => {
      dispatch({ type: 'SET_DATA', payload: [k, route.loadedData[k]] }); // todo: setValue instead
    });
  }
  if (tpl && tpl.loadedActions) {
    Object.keys(tpl.loadedActions).forEach((actionsName) => {
      Logger.of('TplRouteData.downloadTemplateData')
        .info('tpl.loadedActions[actionsName]=', tpl.loadedActions[actionsName], 'store=', store);
      const actionsList = tpl.loadedActions[actionsName].actions;
      if (actionsList.dispatch) {
        Object.keys(actionsList.dispatch).forEach((event) => {
          const type = actionsList.dispatch[event].type;
          let payload;
          if (actionsList.dispatch[event].payload) {
            payload = actionsList.dispatch[event].payload;
          } else if (actionsList.dispatch[event]['@payload']) {
            payload = getValue(actionsList.dispatch[event], 'payload', getDocumentContext(store.getState()));
          }
          dispatch({ type, payload });
        });
      }
    });
  }
  const queue = [];
  enqueueDataStream(queue, route.loadedDocuments, getDocumentContext(store.getState()), 'SAVE_DATA_DOCUMENT');
  if (tpl) enqueueDataStream(queue, tpl.loadedDocuments, getDocumentContext(store.getState()), 'SAVE_DATA_DOCUMENT');
  if (route.loadedQueries) initChunks(route.loadedQueries, dispatch);
  enqueueDataStream(queue, route.loadedQueries, getDocumentContext(store.getState()), 'SAVE_DATA_QUERY');
  if (tpl && tpl.loadedQueries) initChunks(tpl.loadedQueries, dispatch);
  if (tpl) enqueueDataStream(queue, tpl.loadedQueries, getDocumentContext(store.getState()), 'SAVE_DATA_QUERY');
  // everything in the queue, download now and call application back

  const queueSync = queue.filter(q => (!q.async));
  const queueAsync = queue.filter(q => (q.async));
  Logger.of('TplRouteData.queue').info('sync=', queueSync, 'async=', queueAsync);
  downloadAllSyncData(ecOptions, dispatch, queueSync, callback);
  downloadAllAsyncData(ecOptions, dispatch, queueAsync);
};

// this action is executed *before* route is applied
export const preloadRouteData = ({ pathname, routes, store, callback }) => {
  const { dispatch } = store;
  const ecOptions = store.getState().globals.ecOptions;
  const queue = [];
  if (routes && routes.length) {
    routes.forEach((route) => {
      if (route.map) {
        // Mapping route data into variables. Note that it may
        const valuesToMap = routePathValues(pathname, route.path);
        valuesToMap.forEach((value, index) => {
          Logger.of('TplRouteLoader.valuesTopMap').info('mapping target', route.map[index], 'value=', value);
          setValue(route.map[index], value, getDocumentContext(store.getState(), dispatch));
        });
      }
      if (route && route.preloadedData) {
        Object.keys(route.preloadedData).forEach((k) => {
          dispatch({ type: 'SET_DATA', payload: [k, route.preloadedData[k]] });
        });
      }
      enqueueDataStream(queue, route.preloadedDocuments, getDocumentContext(store.getState()), 'SAVE_DATA_DOCUMENT');
      enqueueDataStream(queue, route.preloadedQueries, getDocumentContext(store.getState()), 'SAVE_DATA_QUERY');
    });
  }
  Logger.of('TplRouteData.preloadDocuments').info('queue.length=', queue.length);
  downloadAllSyncData(ecOptions, dispatch, queue, callback);
};

export default {
  routePathValues,
  downloadTemplateData,
  preloadRouteData
};
