import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$Ne } from './Operation$Ne';

const context = {
  mocka: {
    value: 'template'
  }
};

describe ('Operation.$Ne', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:value', op2: 'temp', operation: '$ne' };
      expect(Operation$Ne(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op1': 'mocka:value', op2: 'template', operation: '$ne' };
      expect(Operation$Ne(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op: 'temp', operation: '$ne' };
    expect(Operation$Ne(cond, context)); expectWarn();
  });
});
