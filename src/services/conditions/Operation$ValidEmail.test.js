import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$ValidEmail } from './Operation$ValidEmail';

const context = {
  mocka: {
    emailOne: 'test@test.com',
    emailTwo: 'test@test'
  }
};

describe ('Operation.$Not.Valid.Email', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:emailOne', operation: '$valid.email' };
      expect(Operation$ValidEmail(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:emailTwo', operation: '$valid.email' };
      expect(Operation$ValidEmail(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op1: 'temp', operation: '$valid.email' };
    expect(Operation$ValidEmail(cond, context)); expectWarn();
  });
});
