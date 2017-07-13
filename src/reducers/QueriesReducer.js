import { createReducer } from './../services/Utils';
import { Logger } from './../services/Logger';

const initialState = {
  q: {},
  d: {},
  inProgress: 0
};

export default createReducer(initialState, {
  WAIT_FOR_DATA: (state) => {
    return { ...state, inProgress: state.inProgress + 1 };
  },
  UPDATE_DATA: (state) => {
    return { ...state, validTill: (new Date()).getTime() };
  },
  SAVE_DATA_QUERY: (state, payload) => {
    const qIndex = payload[0];
    const rows = payload[1].rows;
    Logger.of('reducer.SAVE_DATA_QUERY').info('SAVE_DATA_QUERY qIndex=', qIndex, 'rows=', rows);
    const newQuery = {}; newQuery[qIndex] = rows;
    const q = { ...state.q, ...newQuery };
    const d = { ...state.d };
    if (payload[1].docs && payload[1].docs.length) {
      payload[1].docs.forEach((doc) => { d[doc._id] = doc; });
    }
    const inProgress = state.inProgress - 1;
    return { ...state, q, d, inProgress };
  },
  SAVE_DATA_DOCUMENT: (state, payload) => {
    const dIndex = payload[0];
    const objDocument = payload[1];
    Logger.of('reducer.SAVE_DATA_DOCUMENT').info('dIndex=', dIndex, 'objDocument=', objDocument);
    const newDocument = {}; newDocument[dIndex] = objDocument;
    const d = { ...state.d, ...newDocument };
    const inProgress = state.inProgress - 1;
    return { ...state, d, inProgress };
  },
  SAVE_DOCUMENTS_COLLECTION: (state, payload) => {
    const d = { ...state.d };
    if (typeof payload === 'undefined') {
      Logger.of('reducer.SAVE_DOCUMENTS_COLLECTION').warn('Invalid rows collection received');
    } else {
      if (payload.rows) {
        Logger.of('reducer.SAVE_DOCUMENTS_COLLECTION').info('payload.rows=', payload.rows);
        payload.rows.forEach((row) => { d[row.doc._id] = row.doc; });
      }
      if (payload.docs) {
        Logger.of('reducer.SAVE_DOCUMENTS_COLLECTION').info('payload.docs=', payload.docs);
        payload.docs.forEach((row) => { d[row.doc._id] = row.doc; });
      }
    }
    return { ...state, d };
  },
  SAVE_PRELOADED: (state, payload) => {
    const preloaded = payload;
    const d = { ...preloaded };
    Logger.of('reducer.SAVE_PRELOADED').info('d=', d);
    return { ...state, d };
  }
});
