import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { ErrorMessageBox } from './ErrorMessageBox';

describe('html.ErrorMessageBox', () => {
  it('is should work', () => {
    const props = { type: 'ErrorMessageBox', value: '...' };
    enableLogger(() => { ErrorMessageBox({ props, context: {} }); });
    expectNoWarn();
  });
});
