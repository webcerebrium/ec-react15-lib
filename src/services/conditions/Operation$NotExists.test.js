import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$NotExists } from './Operation$NotExists';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation.$Not.Exists', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:temp', operation: '$Not.Exists' };
      expect(Operation$NotExists(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:value', operation: '$Not.Exists' };
      expect(Operation$NotExists(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { '@op1': 'temp', operation: '$Not.Exists' };
    expect(Operation$NotExists(cond, context)); expectWarn();
  });
});
