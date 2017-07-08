import { Logger } from './Logger';
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
