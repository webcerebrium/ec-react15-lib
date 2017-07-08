import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { GridLayout } from './GridLayout';

describe('html.GridLayout', () => {
  it('is should work with empty container', () => {
    const props = { type: 'GridLayout', container: [] };
    enableLogger(() => { GridLayout({ props, context: {} }); });
    expectNoWarn();
  });
  it('is not working without container', () => {
    const props = { type: 'GridLayout' };
    GridLayout({ props, context: {} });
    expectWarn();
  });
});
