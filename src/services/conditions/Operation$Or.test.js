import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Or } from './Operation$Or';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation.$Or', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = {
        op: [
          {
            '@op': 'mocka:value',
            operation: '$exists'
          },
          {
            '@op': 'mocka:value',
            operation: '$exists'
          }
        ],
        operation: '$or'
      };
      expect(Operation$Or(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = {
        op: [
          {
            '@op': 'mocka:value',
            operation: '$not.exists'
          },
          {
            '@op': 'mocka:value',
            operation: '$not.exists'
          }
        ],
        operation: '$or'
      };
      expect(Operation$Or(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op1: 'temp', operation: '$or' };
    expect(Operation$Or(cond, context)); expectWarn();
  });
});
