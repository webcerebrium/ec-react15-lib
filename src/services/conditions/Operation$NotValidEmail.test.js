import { enableLogger, expectWarn, expectNoWarn } from './../Logger.mock';
import { Operation$NotValidEmail } from './Operation$NotValidEmail';

const context = {
  mocka: {
    emailOne: 'test@test.com',
    emailTwo: 'test@test'
  }
};

describe ('Operation.$Not.Valid.Email', () => {
  it('should work on correct operands and return true', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:emailTwo', operation: '$not.valid.email' };
      expect(Operation$NotValidEmail(cond, context)).toEqual(true);
    });
    expectNoWarn();
  });
  it('should work on correct operands and return false', () => {
    enableLogger(() => {
      const cond = { '@op': 'mocka:emailOne', operation: '$not.valid.email' };
      expect(Operation$NotValidEmail(cond, context)).toEqual(false);
    });
    expectNoWarn();
  });
  it('should not work on incorrect operands', () => {
    const cond = { op1: 'temp', operation: '$not.valid.email' };
    expect(Operation$NotValidEmail(cond, context)); expectWarn();
  });
});
