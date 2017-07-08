import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Loader } from './Loader';

describe('html.Loader', () => {
  it('is should work with no params', () => {
    const props = { type: 'Loader' };
    enableLogger(() => { Loader({ props, context: {} }); });
    expectNoWarn();
  });
});
