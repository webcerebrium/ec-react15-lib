import { Logger } from './Logger';
import { triggerAction } from './DocumentAction';
import * as conditionsBundle from './conditions';

export const matchConditions = (props, conditions, context) => {
  if (!conditions) return false;
  return conditions.every((condition) => {
    let conditionOperation = condition.operation ? condition.operation : '$eq';
    conditionOperation = conditionOperation.indexOf('.') ? conditionOperation.replace('.', '') : conditionOperation;
    const singleConditionMatching = conditionsBundle[conditionOperation];
    if (singleConditionMatching !== undefined) {
      return singleConditionMatching(condition, context);
    }
    Logger.of('DocumentCondition.matchConditions').warn('Function for ', conditionOperation, ' is absent');
    return false;
  });
};

export const getStyleFromConditions = (props, context) => {
  const style = {};
  if (props.if) {
    Object.keys(props.if).forEach((conditionAlias) => {
      const cond = props.if[conditionAlias];
      Logger.of('DocumentCondition.getStyleFromCondition').info('conditionAlias', conditionAlias, cond);
      if (cond.properties && matchConditions(props, cond.conditions, context)) {
        Object.keys(cond.properties).forEach((k) => { style[k] = cond.properties[k]; });
      }
    });
  }
  return style;
};


export const getFromCondition = (field, props, context) => {
  let result = props[field];
  if (props.if) {
    Logger.of('DocumentCondition.getFromCondition').info('checking field=', field, 'if=', props.if);
    Object.keys(props.if).forEach((conditionAlias) => {
      const cond = props.if[conditionAlias];
      if (cond.properties && cond.properties[field] && matchConditions(props, cond.conditions, context)) {
        result = cond.properties[field];
        Logger.of('DocumentCondition.getFromCondition').info('match', result);
      }
    });
  }
  return result;
};

export const conditionalSet = (props, context) => {
  if (props.if) {
    Object.keys(props.if).forEach((conditionAlias) => {
      const cond = props.if[conditionAlias];
      Logger.of('DocumentCondition.conditionalSet').info('conditionAlias', conditionAlias, cond);
      if (cond.actions && matchConditions(props, cond.conditions, context)) {
        triggerAction(cond, context);
      }
    });
  }
};

