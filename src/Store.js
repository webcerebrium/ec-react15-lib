import { browserHistory, hashHistory } from 'react-router';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { responsiveStoreEnhancer, createResponsiveStateReducer } from 'redux-responsive';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import reducers from './reducers';

const state = window.__initialState__ || {}; // eslint-disable-line

const isFrontend = (websiteConfig) => {
  // website-config for public websites (browser-routing)
  // webapp-config for admin areas (hash-routing)
  return websiteConfig.type === 'website-config';
};

// Because the server has no DOM available, the history singletons (browserHistory and hashHistory)
// do not function on the server. Instead, they will simply return undefined.
export const getStore = (ecOptions) => {
  // websiteConfig.distributions contains distribution names, add reducers from there
  // const history = isFrontend(websiteConfig) ? browserHistory : hashHistory;
  const appReducers = ecOptions.reducers ? ecOptions.reducers : {};
  return createStore(
    combineReducers({
      ...reducers,
      ...appReducers,
      browser: createResponsiveStateReducer({ xs: 544, sm: 768, md: 992, lg: 1200, xl: 10000 })
    }),
    compose(
      responsiveStoreEnhancer,
      applyMiddleware(routerMiddleware(hashHistory), thunk)
    )
  );
};

export const syncHistory = (websiteConfig, storeInstance) => {
  const history = isFrontend(websiteConfig) ? browserHistory : hashHistory;
  return syncHistoryWithStore(history, storeInstance);
};

export default {
  getStore, syncHistory
};
