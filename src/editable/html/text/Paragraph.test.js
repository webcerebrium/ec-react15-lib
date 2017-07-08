import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Paragraph } from './Paragraph';

describe('html.Paragraph', () => {
  it('should work ', () => {
    const props = { type: 'Paragraph', value: '...' };
    enableLogger(() => { Paragraph({ props, context: {} }); });
    expectNoWarn();
  });
  it('not working without value', () => {
    const props = { type: 'Paragraph' };
    Paragraph({ props, context: {} });
    expectWarn();
  });
});
