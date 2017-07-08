import { Logger } from './../Logger';
import { getValue } from './../DocumentData';
import { checkProperties } from './../TplStyling';

export const Operation$Not = (cond, context) => {
  Logger.of('Operation.$Not').info('condition=', cond, 'context=', context);
  if (!checkProperties({
    props: cond, context, optional: ['debug'], mandatory: ['op', 'operation']
  })) return false;
  const op = getValue(cond, 'op', context);
  Logger.of('Operation.$Not').info('Not op=', op, 'cond=', cond);
  return !op;
};

export default { Operation$Not };
