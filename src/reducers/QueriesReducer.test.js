import reducer from './QueriesReducer';
import { enableLogger, expectNoWarn } from './../services/Logger.mock';

const state = { q: {}, d: {}, inProgress: 0 };
describe('QueriesReducer', () => {
  it('SAVE_DATA_QUERY should work with 2 rows', () => {
    const rows = [{ row: 1 }, { row: 2 }];
    const reduced = reducer(state, { type: 'SAVE_DATA_QUERY', payload: ['myView', { rows }] })
    expectNoWarn();
    expect(reduced.q.myView.length).toEqual(2);
  });
});
