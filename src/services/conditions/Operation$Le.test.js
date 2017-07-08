import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Le } from './Operation$Le';

const context = {
  mocka: {
    numberOne: 1,
    numberTwo: 2
  }
};

describe ('Operation.$Le', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberOne', '@op2': 'mocka:numberTwo', operation: '$le' };
      expect(Operation$Le(cond, context)).toEqual(true);
    });
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:numberTwo', '@op2': 'mocka:numberOne', operation: '$le' };
      expect(Operation$Le(cond, context)).toEqual(false);
    });
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp', operation: '$le' };
    expect(Operation$Le(cond, context));
    expectWarn();
  });
});
