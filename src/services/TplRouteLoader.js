import { push } from 'react-router-redux';
import { Logger } from './Logger';
import { routesMatchPath, routePathValues } from './TplRoute';
import { getValue, setValue } from './DocumentData';
import { getDocumentContext } from './TplContext';
import { downloadTemplateData } from './TplRouteData';

// auth is required - should be changed according to options
const authIsRequired = (route) => {
  if (!route.noAuth) return false;
  if (window.AUTH_TOKEN_STORAGE) { // eslint-disable-line
    return !localStorage.getItem(window.AUTH_TOKEN_STORAGE); // eslint-disable-line
  }
  return true;
};
const isAuthorized = () => {
  if (window.AUTH_TOKEN_STORAGE) { // eslint-disable-line
    return localStorage.getItem(window.AUTH_TOKEN_STORAGE); // eslint-disable-line
  }
  return false;
};

const getTemplateDocument = tpl => (tpl ? `--Template-${tpl}` : '');
const getLayoutDocument = tpl => (tpl ? `--Layout-${tpl}` : '');

const onDataReady = (route, context, callback) => {
  const title = getValue(route, 'title', context);
  Logger.of('TplRouteLoader.onDataReady').info('title=', title, 'route=', route);
  window.document.title = title; //esline-disable-line
  callback();
};

export const onEnterRoute = (store) => {
  const { authStorage, userStorage, routes, dispatch } = store;
  return (nextState, replace, callback) => {
    window.AUTH_TOKEN_STORAGE = authStorage; // eslint-disable-line
    window.AUTH_USER_STORAGE = userStorage;
    Logger.of('TplRouteLoader.onEnterRoute').info('authStorage=', authStorage, 'userStorage=', userStorage);

    const pathname = nextState.location.pathname;
    // look through the routes table to match acceptable routes for current path.
    Logger.of('TplRouteLoader.onEnterRoute').info('pathname', nextState.location.pathname, 'routes=', routes);
    const routesByPath = routesMatchPath(pathname, routes);
    if (routesByPath.length === 0) {
      Logger.of('TplRouteLoader.onEnterRoute').error('route was not found, pathname=', pathname, 'routes=', routes);
    } else {
      // there might be a few routes - with various types, and we need to download _id-document to determine
      // what route should act exactly
      const route = routesByPath[0];
      Logger.of('TplRouteLoader.onEnterRoute').info('noAuth=', route.noAuth,
        'template=', route.template, 'layout=', route.layout);
      if (authIsRequired(route)) {
        dispatch(push(route.noAuth));
      } else if (isAuthorized() && route.withAuth) {
        Logger.of('TplRouteLoader.onEnterRoute').info('isAuthorized and route.withAuth');
        dispatch(push(route.withAuth));
      } else {
        // receive documents and data that are required to be downloaded - from route rules
        dispatch({ type: 'SET_DATA', payload: ['template', getTemplateDocument(route.template)] });
        dispatch({ type: 'SET_DATA', payload: ['layout', getLayoutDocument(route.layout)] });
        dispatch({ type: 'SET_DATA', payload: ['pathname', pathname] });
        dispatch({ type: 'SET_DATA', payload: ['doc', {}] });
        dispatch({ type: 'SET_DATA', payload: ['route', route] });
        if (route.map) {
          // Mapping route data into variables
          const valuesToMap = routePathValues(pathname, route.path);
          valuesToMap.forEach((value, index) => {
            Logger.of('TplRouteLoader.valuesTopMap').info('mapping target', route.map[index], 'value=', value);
            setValue(route.map[index], value, getDocumentContext(store.getState(), dispatch));
          });
        }
        const documentIndex = getTemplateDocument(route.template);
        const tplDoc = store.getState().queries.d[documentIndex];
        if (typeof tplDoc === 'undefined') {
          Logger.of('TplRouteLoader.onEnterRoute').error('Template Not Found. DocumentIndex=', documentIndex);
          return;
        }
        downloadTemplateData({
          route,
          tpl: tplDoc,
          store,
          callback: () => {
            // notifying all reducers of what we currently have in the store.
            // this is used for setting up defaults at them.
            dispatch({ type: 'INIT_DATA', payload: store.getState() });
            // Logger.of('TplRouteLoader.Ready').info('state=', store.getState());
            onDataReady(route, getDocumentContext(store.getState(), dispatch), callback);
            // route is released, we are starting to run hooks from plugins
            const ecOptions = store.getState().globals.ecOptions;
            if (ecOptions.plugins && ecOptions.plugins.length) {
              ecOptions.plugins.forEach((plugin) => {
                if (typeof plugin.onDataReady === 'function') plugin.onDataReady({ route, tpl: tplDoc, store });
              });
            }
          }
        });
      }
    }
  };
};

export const onLeaveRoute = (store) => {
  return () => {
    window.document.title = ''; //esline-disable-line
    Logger.of('TplRouteLoader.onLeaveRoute').info('state', store.getState());
  };
};
