import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { InputDropdown } from './InputDropdown';

describe('html.InputDropdown', () => {
  it('is should work with no options', () => {
    const props = { type: 'InputDropdown', target: 'g:data', options: [] };
    const globals = { data: false };
    enableLogger(() => { InputDropdown({ props, context: { globals } }); });
    expectNoWarn();
  });
});
