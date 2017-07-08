import { createReducer } from './../services/Utils';
import { Logger } from './../services/Logger';
import { deepSet } from './../services/DocumentObject';

const initialState = {
};

export default createReducer(initialState, {
  SET_DATA: (state, payload) => {
    const copy = { ...state };
    const key = payload[0];
    const newValue = payload[1];
    const firstDotIndex = key.indexOf('.');
    if (firstDotIndex === -1) {
      Logger.of('reducers.SET_DATA').info('destination=', payload[0]);
      copy[key] = newValue;
    } else {
      Logger.of('reducers.SET_DATA').info('destination=', payload[0]);
      deepSet(copy, key, newValue);
    }
    return { ...copy };
  }
});
