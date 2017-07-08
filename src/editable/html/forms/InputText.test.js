import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { InputText } from './InputText';

describe('html.InputText', () => {
  it('is should work', () => {
    const props = { type: 'InputText', target: 'g:data' };
    const globals = { data: false };
    enableLogger(() => { InputText({ props, context: { globals } }); });
    expectNoWarn();
  });
  it('is should work as text area', () => {
    const props = { type: 'InputText', target: 'g:data', rows: 5 };
    const globals = { data: false };
    enableLogger(() => { InputText({ props, context: { globals } }); });
    expectNoWarn();
  });
});
