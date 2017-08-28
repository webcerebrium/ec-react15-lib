import { Logger } from './Logger';
import { trackEvent } from './Tracking';
import { getValue, setValue } from './DocumentData';
import { DB, getErrorString } from './ApiRequest';

export const triggerNavigation = (props, statements, context) => {
  statements.forEach((rule) => {
    const link = getValue(rule, 'to', context);
    Logger.of('DocumentAction.triggerNavigation').info('link=', link);
    if (rule.target === 'this') {
      window.location.href = link; // eslint-disable-line
    } else if (rule.target === 'blank') {
      window.open(link); // eslint-disable-line
    } else {
      context.onNavigate(link);
    }
  });
};

export const triggerSet = (props, statements, context) => {
  Logger.of('DocumentAction.triggerSet').info('statements=', statements, 'context=', context);
  statements.forEach((rule) => {
    const current = getValue(Object.assign({}, props, rule), 'value', context);
    const target = getValue(rule, 'target', context);
    Logger.of('DocumentAction.triggerSet').info('current=', current, 'target=', target);
    setValue(target, current, context);
  });
};

export const triggerDispatch = (props, statements, context) => {
  statements.forEach((event) => {
    const payload = getValue(Object.assign({}, props, event), 'payload', context);
    Logger.of('DocumentAction.triggerDispatch', 'event=', event);
    context.onDispatch(event.type, payload);
  });
};

export const triggerSend = (props, statements, context) => {
  Logger.of('DocumentAction.triggerSend').info('statements=', statements);
  const statementFunc = (rule) => {
    return new Promise((resolve, reject) => {
      const link = getValue(rule, 'to', context);
      const method = getValue(rule, 'method', context);
      const src = rule.data || rule['@data'];
      let obj = {};
      if (typeof src === 'object') {
        Object.keys(src).forEach((k) => {
          if (k.indexOf('@') !== 0) {
            obj[k] = src[k];
          } else {
            const propsCopy = { ...props, '@dataTemp': src[k] };
            obj[k.substring(1)] = getValue(propsCopy, 'dataTemp', context || {});
          }
        });
      } else {
        const propsCopy = { ...props, '@dataTemp': src };
        obj = getValue(propsCopy, 'dataTemp', context || {});
      }
      if (rule.errorTarget) { setValue(rule.errorTarget, '', context); }
      if (rule.loadingTarget) { setValue(rule.loadingTarget, 'in_progress', context); }
      // const ecO = context.globals.ecOptions;
      const actionsFunc = (data) => {
        const err = getErrorString(data);
        if (rule.loadingTarget) { setValue(rule.loadingTarget, err ? 'error' : 'ready', context); }
        if (err) {
          if (rule.errorTarget) { setValue(rule.errorTarget, err, context); }
          Logger.of('DocumentAction.triggerSend').warn('submission failure', err);
          reject(data);
        } else {
          if (rule.set) {
            Logger.of('DocumentAction.triggerSend.Rule.Set').info('context=', context, 'data=', data);
            triggerSet(props, rule.set, { ...context, data });
          }
          Logger.of('DocumentAction.triggerSend').info('submission success');
          /* // todo: onResponseReceived handler
          if (ecO.cloudunit && ecO.cloudunit.onResponseReceived) {
            // check conditions of onResponseReceived
            // if they match, call triggerAction
          } else { */
          if (rule.go) {
            triggerNavigation(props, rule.go, context);
          }
          resolve(data);
          /* } */
        }
      };
      if (method === 'GET') {
        DB(context.globals.ecOptions).fetchOne(link).then(actionsFunc);
      } else {
        DB(context.globals.ecOptions).send(method, link, obj).then(actionsFunc, errorData => reject(errorData));
      }
    });
  };
  return Promise.all(statements.map(statementFunc))
    .then(results => results, err => err);
};
// eslint-disable consistent-return

// this accepts template properties
export const triggerAction = (props, context) => {
  if (!props.actions) {
    Logger.of('triggerAction').warn('No actions descriptor on trigger', props);
    return new Promise(reject => reject('No actions descriptor on trigger'));
  }
  const actions = props.actions;
  if (actions.set) {
    triggerSet(props, actions.set, context);
  }
  if (actions.dispatch) {
    triggerDispatch(props, actions.dispatch, context);
  }
  if (actions.go) {
    triggerNavigation(props, actions.go, context);
  }
  if (actions.send) {
    return triggerSend(props, actions.send, context).then(results => results, err => err);
  }
  if (props.tracking) trackEvent(props.tracking);
  if (context && typeof context.onTriggerComplete === 'function') { context.onTriggerComplete(); }
  if (typeof props.onTriggerComplete === 'function') { props.onTriggerComplete(); }
  return new Promise(resolve => resolve('All actions finished'));
};
