import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Eq } from './Operation$Eq';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation.$Eq', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:value', op2: 'template' };
      expect(Operation$Eq(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:value', op2: 'temp' };
      expect(Operation$Eq(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp' };
    expect(Operation$Eq(cond, context)); expectWarn();
  });
});
