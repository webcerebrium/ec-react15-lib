import { Logger } from './Logger';
import { preloadRouteData } from './TplRouteData';
import { matchConditions } from './DocumentCondition';
import { getDocumentContext } from './TplContext';
/* eslint-disable no-continue, no-useless-escape */

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const routesMatchPath = (path, routes) => {
  const res = [];
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const routePath = route.path;
    if (!routePath) { continue; }
    let match = false;
    const hasMask = routePath.indexOf('*') !== -1;
    if (hasMask) {
      // the case when routepath has some mask, replace the mask into regex,
      // then test path with that regex
      let regexTpl = escapeRegExp(routePath);
      regexTpl = replaceAll(regexTpl, '\\*\\*', '.+');
      regexTpl = replaceAll(regexTpl, '\\*', '[^/]+');
      // Logger.of('routePath').info(routePath, 'regex=', regexTpl);
      const regex = new RegExp(regexTpl);
      if (regex.test(path)) { match = true; }
    } else {
      match = (routePath === path);
    }
    if (match) { Logger.of('TplRoute.routesMatchPath').info('routePath=', routePath, 'match=', match); }
    if (match) {
      if (!hasMask) {
        res.length = 0;
        res.push(route); break;
      } else {
        res.push(route);
      }
    }
  }
  Logger.of('TplRoute.routesMatchPath').info('path=', path, res);
  return res;
};

export const routeFromPreloaded = (pathname, routesByPath, store, callback) => {
  // we know what to do when we have just a single route
  if (routesByPath.length === 1) { callback(routesByPath[0]); return; }
  const cb = () => {
    const context = getDocumentContext(store.getState(), store.dispatch);
    let route = {};
    // go through every route in the list and check if condition match
    routesByPath.forEach((r) => {
      const match = (r.conditions) ? matchConditions({}, r.conditions, context) : true;
      if (match) {
        Logger.of('TplRoute.routeFromPreloaded.match').info('route=', r);
        route = r;
      }
    });
    callback(route);
  };

  // but if we have multiple routes. we are trying to
  const routesNoOverride = routesByPath.filter(r => (typeof r.override === 'undefined' || r.override !== false));
  // if we found single route excluding routes that do not need preload
  const routes = (routesNoOverride.length === 1) ? routesNoOverride : routesByPath;
  Logger.of('TplRoute.routeFromPreloaded.routes').info('routes=', routes);
  if (routes.length === 1) { callback(routes[0]); return; }

  preloadRouteData({ pathname, routes, store, callback: cb });
};
