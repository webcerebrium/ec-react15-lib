import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Link } from './Link';

describe('html.Link', () => {
  it('is should work with empty container', () => {
    const props = { type: 'Link', href: '#', container: [] };
    enableLogger(() => { Link({ props, context: {} }); });
    expectNoWarn();
  });
  it('is not working without href', () => {
    const props = { type: 'Link' };
    Link({ props, context: {} });
    expectWarn();
  });
});
