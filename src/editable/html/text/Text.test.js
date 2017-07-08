import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Text } from './Text';

describe('html.Text', () => {
  it('should work', () => {
    const props = { type: 'Text', value: '...' };
    enableLogger(() => { Text({ props, context: {} }); });
    expectNoWarn();
  });

  it('not working without value', () => {
    const props = { type: 'Text' };
    Text({ props, context: {} });
    expectWarn();
  });
});
