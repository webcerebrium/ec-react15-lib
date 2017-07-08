import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Ge } from './Operation$Ge';

const context = {
  mocka: {
    numberOne: 1,
    numberTwo: 2
  }
};

describe ('Operation.$Ge', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberTwo', '@op2': 'mocka:numberOne', operation: '$ge' };
      expect(Operation$Ge(cond, context)).toEqual(true);
    });
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberOne', '@op2': 'mocka:numberTwo', operation: '$ge' };
      expect(Operation$Ge(cond, context)).toEqual(false);
    });
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp', operation: '$ge' };
    expect(Operation$Ge(cond, context)); expectWarn();
  });
});
