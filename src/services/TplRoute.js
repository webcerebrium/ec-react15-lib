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
  if (routesByPath.length === 1) { callback(routesByPath[0]); return; }
  const cb = () => {
    const context = getDocumentContext(store.getState(), store.dispatch);
    let route = {};
    Logger.of('TplRoute.routeFromPreloaded').info('routesByPath=', routesByPath,
      'context=', JSON.stringify(context.docs.post));
    Logger.of('TplRoute.routeFromPreloaded').warn('post.type=', context.docs.post.type);
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
  preloadRouteData({ pathname, routes: routesByPath, store, callback: cb });
};
