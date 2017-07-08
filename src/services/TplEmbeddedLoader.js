import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Logger } from './Logger';
import { getDocumentContext } from './TplContext';
import { matchConditions } from './DocumentCondition';
import { findDocumentElements } from './DocumentSelector';
import { downloadTemplateData } from './TplRouteData';
import ApplicationContainer from './../containers/ApplicationContainer';

const getTemplateDocument = tpl => (tpl ? `--Template-${tpl}` : '');

export const onStartApplications = (store, mount, callback) => {
  const context = getDocumentContext(store.getState());
  mount.forEach((potentialMount) => {
    // 1) - there has to be potentialMount.selector on the page currently
    const elementRoot = findDocumentElements(potentialMount.selector, document); // eslint-disable-line
    Logger.of('TplEmbeddedLoader.onStartApplication').info('check for mounting',
      potentialMount, 'elementRoot=', elementRoot);
    if (elementRoot) {
      // 2) - potentialMount.condition should be valid.
      let match = true;
      if (potentialMount.condition) {
        match = matchConditions({}, potentialMount.condition, context);
        Logger.of('TplEmbeddedLoader.onStartApplication').info('check for conditions',
          potentialMount.condition, match);
      }
      if (match) {
        // confirmed 'route' match
        const route = potentialMount;
        const { dispatch } = store;
        // we have both element and condition match, mounting it
        // and how to pass ... anything... ? it has global redux mapping...
        Logger.of('TplEmbeddedLoader.onStartApplication').info('mounting template', potentialMount.template);
        const tpl = getTemplateDocument(potentialMount.template);
        dispatch({ type: 'SET_DATA', payload: ['template', tpl] });

        downloadTemplateData({
          route,
          tpl,
          store,
          callback: () => {
            // notifying all reducers of what we currently have in the store.
            // this is used for setting up defaults at them.
            dispatch({ type: 'INIT_DATA', payload: store.getState() });
            // Logger.of('TplRouteLoader.Ready').info('state=', store.getState());
            // onDataReady(route, getDocumentContext(store.getState(), dispatch), callback);
            // route is released, we are starting to run hooks from plugins
            const ecOptions = store.getState().globals.ecOptions;
            if (ecOptions.plugins && ecOptions.plugins.length) {
              ecOptions.plugins.forEach((plugin) => {
                if (typeof plugin.onDataReady === 'function') {
                  plugin.onDataReady({ route, tpl, store });
                }
              });
            }
            if (typeof callback === 'function') callback();
          }
        });
        const application = (
          <Provider store={store}>
            <ApplicationContainer />
          </Provider>
        );
        render(application, elementRoot);
      }
    }
  });
};

export default {
  onStartApplications
};
