import { enableLogger, expectWarn, expectNoWarn } from './Logger.mock';
import { checkProperties } from './TplStyling';

describe('checkProperties', () => {
  it('should not pass with extra parameters', () => {
    const parent = { type: 'MockParent' };
    const props = { type: 'MockElement', abs: 1, test: 2, three: 3 };
    checkProperties({ props, context: {}, parent, styling: [] });
    expectWarn();
  });
  it('should pass with * in optional', () => {
    enableLogger(() => {
      const parent = { type: 'MockParent' };
      const props = { type: 'MockElement', abs: 1, test: 2, three: 3 };
      checkProperties({ props, context: {}, parent, styling: [], optional: ['*'] });
    });
    expectNoWarn();
  });
  it('should pass for evaluated parameters', () => {
    const parent = { type: 'MockParent' };
    const props = { type: 'Image', '@src': 'g:test' };
    enableLogger(() => {
      checkProperties({ props, context: {}, parent, optional: ['src'], styling: ['Inline', 'Visibility'] });
    });
    expectNoWarn();
  });
});
