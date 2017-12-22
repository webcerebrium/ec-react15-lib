import { push } from 'react-router-redux';
import { Logger } from './Logger';
import { findNodeFromXY, getNodeById } from './DocumentTree';
import { triggerAction } from './DocumentAction';
import { getWritableValue } from './DocumentData';
import { getDocumentContext } from './TplContext';

export const onApplicationReady = (ecOptions, dispatch, context, store) => {
  const __w = window; // eslint-disable-line no-undef
  const __p = __w.parent; // eslint-disable-line no-undef

  if (!ecOptions.disableMessaging) {
    // Send the message 'NodeReady' to the parent window, notifying editor about successfull mount
    if (__p) {
      setTimeout(() => {
        const title = __w.document.title;
        const template = ''; // what is the route template there?
        const data = { who: __w.location.href, title, template };
        __p.postMessage({ message: 'EDITOR_NOTIFY_READY', data }, '*');
        Logger.of('DocumentDispatcher.MessageSent').warn('NodeReady: message sent to parent', __w.location.href);
      }, 1000);
    }
  } else {
    __w.addEventListener('resize', () => {
      // when the window is resized, editor could be removed
      const data = { id: '', rect: null, path: [], document: '' };
      __p.postMessage({ message: 'EDITOR_MOUSE_OVER_ID', data }, '*');
      __p.postMessage({ message: 'EDITOR_SELECT_FROM_ID', data }, '*');
    });
  }
  __w.addEventListener('message', (e) => {
    Logger.of('DocumentDispatcher.MessageReceived').info(
      'message=', e.data, 'location=', __w.location.href, '__p=', __p);
    if (e.data.message === 'EDITOR_MOUSE_OVER_XY') {
      const result = findNodeFromXY(e.data.x, e.data.y, e.data.scale);
      const data = { id: result.id, rect: result.rect, path: result.path, document: result.document };
      Logger.of('DocumentDispatcher.EDITOR_MOUSE_OVER_XY').info('x=', e.data.x, 'y=', e.data.y, 'data=', data);
      const msg = { message: 'EDITOR_MOUSE_OVER_ID', data };
      __p.postMessage(msg, '*');
    } else if (e.data.message === 'EDITOR_SELECT_FROM_XY') {
      const result = findNodeFromXY(e.data.x, e.data.y, e.data.scale);
      const data = { id: result.id, rect: result.rect, path: result.path, document: result.document };
      Logger.of('DocumentDispatcher.EDITOR_SELECT_FROM_XY').info('x=', e.data.x, 'y=', e.data.y, 'data=', data);
      const msg = { message: 'EDITOR_SELECT_FROM_ID', data };
      __p.postMessage(msg, '*');
    } else if (e.data.message === 'EDITOR_SELECT_FROM_PATH') {
      if (e.data.selectedId) {
        const result = getNodeById(e.data.selectedId);
        const data = { id: result.id, rect: result.rect, path: result.path, document: result.document };
        const msg = { message: 'EDITOR_SELECT_FROM_ID', data };
        __p.postMessage(msg, '*');
      } else {
        Logger.of('DocumentDispatcher.EDITOR_SELECT_FROM_PATH').warn('ID of selected element is not found');
      }
    } else if (e.data.message === 'EDITOR_UPDATE_DATA') {
      const dIndex = e.data.dIndex;
      const objDocument = e.data.objDocument;
      if (dIndex && objDocument) {
        dispatch({ type: 'SAVE_DATA_DOCUMENT', payload: [dIndex, objDocument] });
      } else {
        Logger.of('DocumentDispatcher.EDITOR_UPDATE_DATA').warn('dIndex =', dIndex, 'objDocument =', objDocument);
      }
    } else if (e.data.message === 'EDITOR_CHANGE_ROUTE') {
      const path = e.data.path;
      if (path) {
        dispatch(push(path));
      } else {
        Logger.of('DocumentDispatcher.EDITOR_CHANGE_ROUTE').warn('path =', path);
      }
    } else if (e.data.message === 'EDITOR_CALL_REMOTE_ACTION') {
      const actions = e.data.actions;
      let row;
      if (e.data.actions.row) {
        row = getWritableValue(e.data.actions.row, getDocumentContext(store.getState(), dispatch), '');
      }
      const ctx = row ? { row } : {};
      if (actions) {
        triggerAction(actions, {
          ...getDocumentContext(store.getState(), dispatch),
          ...ctx,
          onNavigate: url => dispatch(push(url)),
          onDispatch: (type, payload) => dispatch({ type, payload })
        });
      } else {
        Logger.of('DocumentDispatcher.EDITOR_CALL_REMOTE_ACTION').warn('actions =', actions);
      }
    } else if (e.data.message === 'EDITOR_GET_FROM_REMOTE_CONTEXT') {
      if (e.data.dataSource) {
        const result = getWritableValue(e.data.dataSource, getDocumentContext(store.getState(), dispatch), '');
        const streamName = e.data.dataSource.substring(e.data.dataSource.indexOf(':') + 1);
        const data = [streamName, result];
        Logger.of('DocumentDispatcher.EDITOR_GET_FROM_REMOTE_CONTEXT').info('data=', data);
        const msg = { message: 'ARBITRARY_VALUE_CHANGE', data };
        __p.postMessage(msg, '*');
      } else {
        Logger.of('DocumentDispatcher.EDITOR_GET_FROM_REMOTE_CONTEXT').warn('DataSource is not found');
      }
    } else if (e.data && e.data.message) {
      // this is some iframe-message, most likely from slave to parent
      dispatch({ type: e.data.message, payload: e.data });
    }
  });
};

export default { onApplicationReady };
