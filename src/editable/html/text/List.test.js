import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { List } from './List';

describe('html.List', () => {
  it('should work ', () => {
    const props = { type: 'List', value: '' };
    enableLogger(() => { List({ props, context: {} }); });
    expectNoWarn();
  });
  it('not working without value', () => {
    const props = { type: 'List' };
    List({ props, context: {} });
    expectWarn();
  });
});
