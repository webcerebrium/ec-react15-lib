import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Not } from './Operation$Not';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation.$Not', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:temp', operation: '$Not' };
      expect(Operation$Not(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:value', operation: '$Not' };
      expect(Operation$Not(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { '@op1': 'temp', operation: '$Not' };
    expect(Operation$Not(cond, context)); expectWarn();
  });
});
