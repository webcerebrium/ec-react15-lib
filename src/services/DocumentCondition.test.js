import { expectNoWarn } from './Logger.mock';
import { matchConditions } from './DocumentCondition';

const props = {};
const context = {
  mocka: {
    value: 'template',
    emailOne: 'test@test.com',
    emailTwo: 'test@test',
    numberOne: 1,
    numberTwo: 2
  },
  browser: {
    mediaType: 'md'
  }
};

describe ('matchConditions', () => {
  /*
  it('should match $exists conditions', () => {
    const conditions = [
      {
        '@op': 'mocka:value',
        operation: '$exists'
      }
    ];
    expect(matchConditions(props, conditions, context)).toEqual(true);
  });
  it('should not match $exists conditions', () => {
    const conditions = [
      {
        '@op': 'mocka:temp',
        operation: '$exists'
      }
    ];
    expect(matchConditions(props, conditions, context)).toEqual(false);
  });
  it('should match default $eq condition', () => {
    const conditions = [
      {
        '@op': 'mocka:temp',
        operation: '$eq'
      }
    ];
    expect(matchConditions(props, conditions, context)).toEqual(true);
  });
  it('should not match. Condition is absent', () => {
    const conditions = [
      {
        '@op': 'mocka:temp',
        operation: '$unknown'
      }
    ];
    expect(matchConditions(props, conditions, context)); expectNoWarn();
  });*/
  it('should be done later - when all operations will be finished', () => {});
});
