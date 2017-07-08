import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Button } from './Button';

describe('html.Button', () => {
  it('is should work with empty container', () => {
    const props = { type: 'Button', container: [], actions: {} };
    enableLogger(() => { Button({ props, context: {} }); });
    expectNoWarn();
  });
  it('is should working without container', () => {
    const props = { type: 'Button', actions: {} };
    enableLogger(() => { Button({ props, context: {} }); });
    expectNoWarn();
  });
  it('is should not work without actions', () => {
    const props = { type: 'Button' };
    Button({ props, context: {} });
    expectWarn();
  });
});
