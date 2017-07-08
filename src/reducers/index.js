import { routerReducer } from 'react-router-redux';
import queriesReducer from './QueriesReducer';
import chunksReducer from './ChunksReducer';
import globalsReducer from './GlobalsReducer';

export default {
  routing: routerReducer,
  queries: queriesReducer,
  chunks: chunksReducer,
  globals: globalsReducer
};

