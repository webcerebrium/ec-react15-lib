import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { InputCheck } from './InputCheck';

describe('html.InputCheck', () => {
  it('is should work', () => {
    const props = { type: 'InputCheck', target: 'g:data' };
    const globals = { data: false };
    enableLogger(() => { InputCheck({ props, context: { globals } }); });
    expectNoWarn();
  });
});
