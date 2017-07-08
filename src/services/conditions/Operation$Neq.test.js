import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Neq } from './Operation$Neq';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation$Neq', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:value', op2: 'temp', operation: '$neq' };
      expect(Operation$Neq(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:value', op2: 'template', operation: '$neq' };
      expect(Operation$Neq(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp', operation: '$neq' };
    expect(Operation$Neq(cond, context)); expectWarn();
  });
});
