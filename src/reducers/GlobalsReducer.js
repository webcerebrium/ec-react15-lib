import { createReducer } from './../services/Utils';
import { Logger } from './../services/Logger';
import { deepSet } from './../services/DocumentObject';
import { getValue } from './../services/DocumentData';

const initialState = {
  dataUpdated: (new Date()).toISOString()
};

export default createReducer(initialState, {
  UPDATE_DATA: (state) => {
    // this is triggered when we are doing something out of redux state
    // but we need to do something in the state tree to trigger all components updates

    // for example this is called when data is updated in localStorage or sessionStorage
    // technically it has to affect state, so this global variable is being updated
    const dataUpdated = (new Date()).toISOString();
    Logger.of('reducers.globals.UPDATE_DATA').info('dataUpdated=', dataUpdated);
    return { ...state, dataUpdated };
  },
  SET_DATA: (state, payload) => {
    if (!payload[0]) return state;
    const copy = { ...state };
    const isDynamic = (payload[0].substring(0, 1) === '@');
    const context = { globals: state };
    const key = isDynamic ? payload[0].substring(1) : payload[0];
    const props = { [payload[0]]: payload[1] };
    const newValue = getValue(props, key, context);
    const firstDotIndex = key.indexOf('.');
    if (firstDotIndex === -1) {
      Logger.of('reducers.globals.SET_DATA').info('destination=', payload[0]);
      copy[key] = newValue;
    } else {
      Logger.of('reducers.globals.SET_DATA').info('destination=', payload[0]);
      deepSet(copy, key, newValue);
    }
    return { ...copy };
  }
});
