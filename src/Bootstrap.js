import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router';
import { Logger } from './services/Logger';
import { DB } from './services/ApiRequest';
import { getStore, syncHistory } from './Store';
import { onEnterRoute, onLeaveRoute } from './services/TplRouteLoader';
import { onStartApplications } from './services/TplEmbeddedLoader';
import { onApplicationReady } from './services/DocumentDispatcher';
import ApplicationContainer from './containers/ApplicationContainer';

const __w = window; // eslint-disable-line no-undef
const __d = document; // eslint-disable-line no-undef

const fatalApplicationError = (elem, errorMessage) => {
  // eslint-disable-next-line
  elem.innerHTML = `<div style='text-align:center' class='alert alert-danger'>${errorMessage}</div>`;
};

const envApplication = (ecOptions, elem) => {
  DB(ecOptions).fetchPreload().then((data) => {
    Logger.of('ec-react15.App').info('Documents preloaded', data);
    const store = getStore(ecOptions);
    store.dispatch({ type: 'SET_DATA', payload: ['ecOptions', ecOptions] });
    const docPreload = document.getElementById('preloadedDocuments'); // eslint-disable-line
    if (docPreload) {
      const preloadedJson = JSON.parse(docPreload.innerText);
      store.dispatch({ type: 'SAVE_PRELOADED', payload: preloadedJson });
      Object.values(preloadedJson).forEach((doc) => { data.rows.push(doc); });
      Logger.of('ec-react15.App').info('preloadedJson=', preloadedJson, 'data.rows=', data.rows);
      store.dispatch({ type: 'SAVE_DOCUMENTS_COLLECTION', payload: data });
    } else if (data) {
      // save preloaded into documents (queries.d)
      store.dispatch({ type: 'SAVE_DOCUMENTS_COLLECTION', payload: data });
    }
    if (ecOptions.mount && ecOptions.template) {
      // we don't have a config, and we are launching from what we are provided in the
      const mount = [{ selector: ecOptions.mount, template: ecOptions.template }];
      Logger.of('ec-react15.App').info('Mounting', mount);
      onStartApplications(store, mount, () => { onApplicationReady(ecOptions, store.dispatch); });
      return;
    }

    const configDocId = (ecOptions.configDoc) ? ecOptions.configDoc : '--Config';
    const found = (data && data.rows) ? data.rows.find(r => r.doc && r.doc._id === configDocId) : false;
    if (!found) {
      Logger.of('ec-react15.App').error(configDocId, 'document could not be loaded. Expected to start the application',
        'data.rows=', data.rows, 'data=', data);
      fatalApplicationError(elem, `Sorry, application configuration could not be loaded now (missing ${configDocId})`);
      return;
    }
    const docWebsiteConfig = found.doc;
    // save website properties
    store.dispatch({ type: 'SET_DATA', payload: ['website', docWebsiteConfig.website] });
    // continue with mounting application
    if (docWebsiteConfig.routes && docWebsiteConfig.routes.length) {
      Logger.of('ec-react15.App').info('Routes', docWebsiteConfig.routes, 'Properties', docWebsiteConfig.website);
      const history = syncHistory(docWebsiteConfig, store);
      onApplicationReady(ecOptions, store.dispatch);
      const application = (
        <Provider store={store}>
          <Router history={history} onUpdate={() => __w.scrollTo(0, 0)}>
            <Route
              path='*'
              component={ApplicationContainer}
              onEnter={onEnterRoute({
                ...store, ...docWebsiteConfig.website, routes: docWebsiteConfig.routes, ecOptions
              })}
              onLeave={onLeaveRoute(store)}
            />
          </Router>
        </Provider>
      );
      render(application, elem);
    } else if (docWebsiteConfig.mount && docWebsiteConfig.mount.length) {
      Logger.of('ec-react15.App').info('Mount', docWebsiteConfig.mount);
      onStartApplications(store, docWebsiteConfig.mount, () => { onApplicationReady(ecOptions, store.dispatch); });
    } else {
      Logger.of('ec-react15.App').info('WebsiteRoutes', docWebsiteConfig.routes,
        'Properties', docWebsiteConfig.website);
      onApplicationReady(ecOptions, store.dispatch);
      const application = (<Provider store={store}><ApplicationContainer /></Provider>);
      render(application, elem);
    }
  });
};

export const bootstrap = (ecOptions = {}) => {
  const selectorApp = ecOptions.app || 'root';
  const selectorLoader = ecOptions.loader || 'loader';
  const elemRootApplication = __d.getElementById(selectorApp);
  if (elemRootApplication) {
    const elemRootLoader = __d.getElementById(selectorLoader);
    envApplication(ecOptions, elemRootApplication, () => {
      elemRootApplication.style.display = 'block';
      if (elemRootLoader) { elemRootLoader.style.display = 'none'; }
    });
  } else {
    Logger.of('ec-react15.Bootstrap').info('No application mounting point, considering embedded applications');
    envApplication(ecOptions, null);
  }
};

export default bootstrap;
