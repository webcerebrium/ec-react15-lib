import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { InputPassword } from './InputPassword';

describe('html.InputPassword', () => {
  it('is should work without mounting', () => {
    const props = { type: 'InputPassword', target: 'g:data' };
    const globals = { data: false };
    enableLogger(() => { InputPassword({ props, context: { globals } }); });
    expectNoWarn();
  });
});
