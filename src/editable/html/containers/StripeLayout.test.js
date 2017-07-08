import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { StripeLayout } from './StripeLayout';

describe('html.StripeLayout', () => {
  it('is should work with empty container', () => {
    const props = { type: 'StripeLayout', container: [] };
    enableLogger(() => { StripeLayout({ section: 'header', props, context: {} }); });
    expectNoWarn();
  });
  it('is not working without container', () => {
    const props = { type: 'StripeLayout' };
    StripeLayout({ section: 'header', props, context: {} });
    expectWarn();
  });
  it('is not working inside container', () => {
    const props = { type: 'StripeLayout' };
    StripeLayout({ section: 'container', props, context: {} });
    expectWarn();
  });
});
