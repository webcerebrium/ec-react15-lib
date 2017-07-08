import { Logger } from './../Logger';
import { checkProperties } from './../TplStyling';

export const Operation$Screens = (cond, context) => {
  Logger.of('Operation.$Screens').info('condition=', cond, 'context=', context);
  if (!checkProperties({
    props: cond, context, optional: ['debug'], mandatory: ['op', 'operation']
  })) return false;
  const mediaType = context.browser && context.browser.mediaType;
  const op = cond.op.some(screen => (mediaType === screen));
  Logger.of('Operation.$Screens').info('Compare op=', op, 'cond=', cond);
  return op;
};

export default { Operation$Screens };
