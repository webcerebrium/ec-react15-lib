import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$L } from './Operation$L';

const context = {
  mocka: {
    numberOne: 1,
    numberTwo: 2
  }
};

describe ('Operation.$L', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberOne', '@op2': 'mocka:numberTwo', operation: '$l' };
      expect(Operation$L(cond, context)).toEqual(true);
    });
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberTwo', '@op2': 'mocka:numberOne', operation: '$l' };
      expect(Operation$L(cond, context)).toEqual(false);
    });
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp', operation: '$l' };
    expect(Operation$L(cond, context)); expectWarn();
  });
});
