import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Divider } from './Divider';

describe('html.Divider', () => {
  it('is should work', () => {
    const props = { type: 'Divider' };
    enableLogger(() => {
      Divider({ props, context: {} });
    });
    expectNoWarn();
  });
});
