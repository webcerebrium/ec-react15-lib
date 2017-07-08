import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Header } from './Header';

describe('html.Header', () => {
  it('should work ', () => {
    const props = { type: 'Header', value: '...' };
    enableLogger(() => { Header({ props, context: {} }); });
    expectNoWarn();
  });
  it('not working without value', () => {
    const props = { type: 'Header' };
    Header({ props, context: {} });
    expectWarn();
  });
});
