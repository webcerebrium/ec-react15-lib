import { createReducer } from './../services/Utils';
import { Logger } from './../services/Logger';
import { deepSet } from './../services/DocumentObject';
import { getValue } from './../services/DocumentData';

const initialState = {
};

export default createReducer(initialState, {
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
      Logger.of('reducers.SET_DATA').info('destination=', payload[0]);
      copy[key] = newValue;
    } else {
      Logger.of('reducers.SET_DATA').info('destination=', payload[0]);
      deepSet(copy, key, newValue);
    }
    return { ...copy };
  }
});
