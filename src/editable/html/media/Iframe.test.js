import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Iframe } from './Iframe';

describe('html.Iframe', () => {
  it('should work ', () => {
    const props = { type: 'Iframe', src: '#' };
    enableLogger(() => { Iframe({ props, context: {} }); });
    expectNoWarn();
  });
  it('should work width margins', () => {
    const props = { type: 'Iframe', src: '#', marginTop: 10, marginBottom: 20 };
    enableLogger(() => { Iframe({ props, context: {} }); });
    expectNoWarn();
  });
  it('not working without src', () => {
    const props = { type: 'Iframe' };
    Iframe({ props, context: {} });
    expectWarn();
  });
});
