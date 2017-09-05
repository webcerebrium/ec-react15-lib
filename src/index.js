import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import reducers from './reducers';
import * as components from './components';
import editableHtml from './editable/html';
import { createReducer } from './services/Utils';
import { Logger } from './services/Logger';
import Debounced from './services/Debounced';
import { trackPageview, trackEvent } from './services/Tracking';
import { deepFind, deepSet, objectPathExists, getObjectPathValue } from './services/DocumentObject';
import { getValue, getEvaluated, getWritableValue, getCompositeValue, setValue } from './services/DocumentData';
import { getDocumentContext } from './services/TplContext';
import { triggerNavigation, triggerSet, triggerDispatch, triggerAction } from './services/DocumentAction';
import { matchConditions, conditionalSet, getFromCondition } from './services/DocumentCondition';
import { findById, searchElements, setValueById } from './services/DocumentTree';
import { getStyling, getStylingProperties, checkProperties } from './services/TplStyling';
import { renderElement, renderChildren, renderDocument } from './services/TplRenderer';
import { routesMatchPath, routePathValues } from './services/TplRoute';
import { onEnterRoute, onLeaveRoute } from './services/TplRouteLoader';
import start from './Bootstrap';

export default {
  Link,
  Dropzone,
  // helper utilities
  Logger,
  Debounced,
  createReducer,
  // event tracker
  trackPageview,
  trackEvent,
  // native components (for forms)
  ...components,
  // default reducers
  reducers,
  // list of ediablt components
  editableHtml,
  // object get/set value helpers
  deepFind,
  deepSet,
  objectPathExists,
  getObjectPathValue,
  // getting value
  getValue,
  getEvaluated,
  getWritableValue,
  getCompositeValue,
  // setting data value
  setValue,
  setValueById,
  // action triggers
  triggerNavigation,
  triggerSet,
  triggerDispatch,
  triggerAction,
  // conditions check
  matchConditions,
  getFromCondition,
  // conditional getter/setter
  conditionalSet, // low level, should not be used?
  // context builder
  getDocumentContext,
  getStyling,
  getStylingProperties,
  checkProperties,
  // work with document tree
  findById,
  searchElements,
  // renderers itself
  renderElement,
  renderDocument,
  renderChildren, // high level, takes repeatable data into consideration, recommended to use
  // routes matching
  routesMatchPath,
  // routes value mapping
  routePathValues,
  // handler for route middleware
  onEnterRoute,
  onLeaveRoute,
  // application bootstapper
  start
};
