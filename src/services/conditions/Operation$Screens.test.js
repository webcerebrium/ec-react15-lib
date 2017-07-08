import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Screens } from './Operation$Screens';

const context = {
  browser: {
    mediaType: 'md'
  }
};

describe ('Operation.$Screens', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = {
        op: ['xs', 'md', 'lg'],
        operation: '$screens'
      };
      expect(Operation$Screens(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = {
        op: ['xs', 'lg'],
        operation: '$screens'
      };
      expect(Operation$Screens(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = {
      op2: 'temp',
      operation: '$screens'
    };
    expect(Operation$Screens(cond, context)); expectWarn();
  });
});
