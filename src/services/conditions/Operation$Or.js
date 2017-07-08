import { Logger } from './../Logger';
import * as conditionsBundle from './';
import { checkProperties } from './../TplStyling';

export const Operation$Or = (cond, context) => {
  Logger.of('Operation.$Or').info('condition=', cond, 'context=', context);
  const isValidProperties = checkProperties({
    props: cond, context, optional: ['debug'], mandatory: ['op', 'operation']
  });
  if (!isValidProperties) return false;
  if (!cond.op.length) {
    Logger.of('Operation.$Or').warn('conditional operation - array expected', cond);
    return false;
  }
  return cond.op.some((condition) => {
    let nestedOperation = condition.operation ? condition.operation : '$eq';
    nestedOperation = nestedOperation.indexOf('.') ? nestedOperation.replace('.', '') : nestedOperation;
    const nestedSingleMatching = conditionsBundle[nestedOperation];
    return nestedSingleMatching(condition, context);
  });
};

export default { Operation$Or };
