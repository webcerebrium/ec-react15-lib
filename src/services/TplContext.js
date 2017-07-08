export const getDocumentContext = (state, dispatch) => {
  const methods = {};
  // map all functions from the state
  Object.keys(state).forEach((key) => {
    if (typeof state[key] === 'function') methods[key] = state[key];
  });
  if (typeof methods.onSet === 'undefined' && dispatch) {
    methods.onSet = (key, value) => {
      dispatch({ type: 'SET_DATA', payload: [key, value] });
    };
  }
  const externalReducers = {};
  const appReducers = state.globals.ecOptions.reducers ? state.globals.ecOptions.reducers : {};
  Object.keys(appReducers).forEach((reducerIndex) => {
    externalReducers[reducerIndex] = state[reducerIndex];
  });
  return {
    docs: state.queries.d,
    queries: state.queries.q,
    chunks: state.chunks.lists, // chunks are unique piece of a query
    browser: state.browser,
    globals: state.globals,
    ...externalReducers,
    ...methods
  };
};

export default {
  getDocumentContext
};
