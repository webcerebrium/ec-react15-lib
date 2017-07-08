import { Logger } from './../Logger';
import { getValue } from './../DocumentData';
import { checkProperties } from './../TplStyling';

const isValidEmail = (email) => {
  /* eslint-disable */
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /* eslint-enable */
  return re.test(email);
};

export const Operation$ValidEmail = (cond, context) => {
  Logger.of('Operation.$Valid.Email').info('condition=', cond, 'context=', context);
  if (!checkProperties({
    props: cond, context, optional: ['debug'], mandatory: ['op', 'operation']
  })) return false;
  const op = isValidEmail(getValue(cond, 'op', context));
  Logger.of('Operation.$Valid.Email').info('Valid Email op=', op, 'cond=', cond);
  return op;
};

export default { Operation$ValidEmail };
