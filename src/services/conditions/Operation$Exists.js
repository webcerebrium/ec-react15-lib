import { Logger } from './../Logger';
import { getValue } from './../DocumentData';
import { checkProperties } from './../TplStyling';

export const Operation$Exists = (cond, context) => {
  Logger.of('Operation.$Exists').info('condition=', cond, 'context=', context);
  if (!checkProperties({
    props: cond, context, optional: ['debug'], mandatory: ['op', 'operation']
  })) return false;
  const op = getValue(cond, 'op', context);
  Logger.of('Operation.$Exists').info('exists op=', op, 'cond=', cond);
  return !!op;
};

export default { Operation$Exists };
