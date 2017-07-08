import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Exists } from './Operation$Exists';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation.$Exists', () => {
  it('should work on correct operand and return true', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:value', operation: '$exists' };
      expect(Operation$Exists(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operand and return false', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:temp', operation: '$exists' };
      expect(Operation$Exists(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { '@op1': 'mocka:value', op2: 'temp', operation: '$exists' };
    expect(Operation$Exists(cond, context)); expectWarn();
  });
});
