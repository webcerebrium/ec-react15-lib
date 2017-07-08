import { Logger } from './../Logger';
import { getValue } from './../DocumentData';
import { checkProperties } from './../TplStyling';

export const Operation$G = (cond, context) => {
  Logger.of('Operation.$G').info('condition=', cond, 'context=', context);
  if (!checkProperties({
    props: cond, context, optional: ['debug'], mandatory: ['op1', 'op2', 'operation']
  })) return false;
  const op1 = getValue(cond, 'op1', context);
  const op2 = getValue(cond, 'op2', context);
  Logger.of('Operation.$G').info('comparing op1=', op1, 'and op2=', op2, 'cond=', cond);
  return op1 > op2;
};

export default { Operation$G };
