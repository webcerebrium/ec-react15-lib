import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { FixedLayout } from './FixedLayout';

describe('html.FixedLayout', () => {
  it('is should work with empty container', () => {
    const props = { type: 'FixedLayout', container: [], top: 10 };
    enableLogger(() => { FixedLayout({ props, context: {}}); });
    expectNoWarn();
  });
  it('is not working without container', () => {
    const props = { type: 'FixedLayout' };
    FixedLayout({ props, context: {}, parent });
    expectWarn();
  });
});
