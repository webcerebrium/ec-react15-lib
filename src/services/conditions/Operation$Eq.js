import { Logger } from './../Logger';
import { getValue } from './../DocumentData';
import { checkProperties } from './../TplStyling';

export const Operation$Eq = (cond, context) => {
  Logger.of('Operation.$Eq').info('condition=', cond, 'context=', context);
  if (!checkProperties({
    props: cond, context, optional: ['debug', 'operation'], mandatory: ['op1', 'op2']
  })) return false;
  const op1 = getValue(cond, 'op1', context);
  const op2 = getValue(cond, 'op2', context);
  Logger.of('Operation.$Eq').info('comparing op1=', op1, 'and op2=', op2, 'cond=', cond);
  return (op1 === op2);
};

export default { Operation$Eq };
