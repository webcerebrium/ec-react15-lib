import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$G } from './Operation$G';

const context = {
  mocka: {
    numberOne: 1,
    numberTwo: 2
  }
};

describe ('Operation.$G', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberTwo', '@op2': 'mocka:numberOne', operation: '$g' };
      expect(Operation$G(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberOne', '@op2': 'mocka:numberTwo', operation: '$g' };
      expect(Operation$G(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp', operation: '$g' };
    expect(Operation$G(cond, context)); expectWarn();
  });
});
