import { createReducer } from './../services/Utils';
import { Logger } from './../services/Logger';

const initialState = {
  descriptors: {},
  lists: {}
};

export default createReducer(initialState, {
  INIT_DATA_QUERY_CHUNKS: (state, payload) => {
    const queryIndex = payload[0];
    const chunk = payload[1];
    const s = { ...state };
    s.descriptors[queryIndex] = chunk;
    return s;
  },

  SAVE_DATA_QUERY: (state, payload) => {
    const queryIndex = payload[0];
    const rows = payload[1].rows;
    if (state.descriptors[queryIndex]) {
      const s = { ...state };
      const chunks = s.descriptors[queryIndex];
      s.lists[queryIndex] = {};
      let index = 0;
      let chunkIndex = 0;
      while (chunkIndex < chunks.length) {
        const chunkId = chunks[chunkIndex].id;
        const chunkLimit = chunks[chunkIndex].limit;
        if (index < rows.length) {
          s.lists[queryIndex][chunkId] = rows.slice(index, index + chunkLimit);
          index += chunkLimit;
        }
        chunkIndex += 1;
      }
      return s;
    }
    Logger.of('reducer.ChunksReducer').info('No descriptor for queryIndex=', queryIndex);
    return state;
  }
});
