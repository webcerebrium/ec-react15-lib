import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { FreeLayout } from './FreeLayout';

describe('html.FreeLayout', () => {
  it('is should work with empty container', () => {
    const props = { type: 'FreeLayout', container: [] };
    enableLogger(() => { FreeLayout({ props, context: {} }); });
    expectNoWarn();
  });
  it('is not working without container', () => {
    const props = { type: 'FreeLayout' };
    FreeLayout({ props, context: {}, parent });
    expectWarn();
  });
});
