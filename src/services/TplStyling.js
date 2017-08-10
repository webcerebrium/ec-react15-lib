import STYLING from './../editable/html/styling';
import POSITIONS from './../editable/html/positions';
import { getStyleFromConditions } from './DocumentCondition';
import { Logger } from './Logger';

// does the same as function above, the only difference is that
// it just returns the list of fields that are used for that style patterns
export const getStylingProperties = ({ styling, props, context }) => {
  Logger.of('getStylingProperties').info('styling =', styling, 'props =', props, 'context =', context);
  if (!styling || !styling.length) return [];
  const libs = STYLING;
  if (context.ecOptions) {
    if (context.ecOptions.styling) {
      context.ecOptions.styling.forEach((key) => { libs[key] = context.ecOptions.styling[key]; });
    }
  }
  const styles = {};
  styling.forEach((name) => {
    const s = libs[name];
    if (!s) { return; }
    if (typeof s.getStyle === 'function') {
      const patternStyles = s.getStyle(props, context);
      Object.keys(patternStyles).forEach((key) => {
        styles[key] = patternStyles[key];
      });
    }
  });
  return Object.keys(styles);
};

export const checkProperties = ({ props, context, styling, mandatory, optional }) => {
  //
  // collecting list of what is allowed
  //
  const allowed = optional && optional.length ? optional.slice() : [];
  if (optional && optional.length && optional[0] === '*') {
    Object.keys(props).forEach((p) => { allowed.push(p.replace('@', '')); });
  } else if (styling) {
    allowed.push('_id');
    allowed.push('type');
    allowed.push('display');
    allowed.push('class');
    allowed.push('className');
    allowed.push('if');
    getStylingProperties({ styling, props, context }).forEach((p) => { allowed.push(p); });
  }

  //
  // collecting list of what is missing
  //
  const missing = [];
  if (mandatory && mandatory.length) {
    mandatory.forEach((p) => {
      allowed.push(p);
      if (typeof props[p] === 'undefined' && typeof props[`@${p}`] === 'undefined') missing.push(p);
    });
  }
  //
  //
  //
  const conditionProperties = getStyleFromConditions(props, context);
  const propsFields = { ...props, ...conditionProperties };
  //
  // collecting list of what is not allowed
  //
  const notAllowed = [];
  Object.keys(propsFields).forEach((p) => {
    const field = p.substring(0, 1) === '@' ? p.substring(1) : p;
    if (allowed.indexOf(field) === -1) notAllowed.push(field);
  });
  Logger.of('TplValidation.checkProperties').info('props=', props, 'conditionProperties=', conditionProperties,
    'notAllowed=', notAllowed, 'missing=', missing, 'allowed= ', allowed);
  if (missing.length) {
    Logger.of('TplValidation.checkProperties').warn(props.type, ' properties Missing=', missing, props);
    return false;
  }
  if (notAllowed.length) {
    Logger.of('TplValidation.checkProperties').warn(props.type,
      ' properties not allowed=', notAllowed, 'allowed=', allowed, props);
    return false;
  }
  return true;
};

// example of usage in final application
// const { styles, classes } = getStylingOf(['block', 'text', 'visibility'], props, context);
// const { styles, classes } = getStylingOf(['inline', 'text', 'visibility'], props, context);
export const getStyling = ({ props, context, pos, childIndex, styling, mandatory, optional }) => {
  const styles = {};
  const classes = [];
  const positions = POSITIONS;
  if (context.ecOptions && context.ecOptions.positions) {
    context.ecOptions.positions.forEach((key) => { positions[key] = context.ecOptions.positions[key]; });
  }
  if (pos) {
    if (typeof positions[pos] !== 'undefined') {
      const additionalOptions = positions[pos].validatePosition(props);
      if (!additionalOptions) {
        return { styles: false, classes: false };
      }
      // now we have additional options to be allowed.
      additionalOptions.forEach(opt => optional.push(opt));
    } else {
      Logger.of('TplElement.getStylingOf').warn('position type', pos, ' is not configured', props);
    }
  }
  Logger.of('getStyling').info('styling =', styling);
  if (!checkProperties({ props, context, styling, mandatory, optional })) {
    return { styles: false, classes: false };
  }
  // styling must be an array
  const libs = STYLING;
  if (context.ecOptions && context.ecOptions.styling) {
    context.ecOptions.styling.forEach((key) => { libs[key] = context.ecOptions.styling[key]; });
  }
  styling.forEach((name) => {
    const s = libs[name];
    if (!s) {
      Logger.of('TplElement.getStylingOf').warn('styling not found', name);
      return;
    } // add warning that styling not found
    if (typeof s.getStyle === 'function') {
      const patternStyles = s.getStyle(props, context);
      Object.keys(patternStyles).forEach((key) => {
        styles[key] = patternStyles[key];
      });
    } else {
      Logger.of('TplElement.getStylingOf').warn('getStyle is not a function', name);
    }
    if (typeof s.getClasses === 'function') {
      const patternClasses = s.getClasses(props, context);
      if (typeof patternClasses.forEach !== 'function') {
        Logger.of('TplElement.getStylingOf').warn('getClasses should return array', name);
      } else {
        patternClasses.forEach((cls) => {
          if (!cls) return;
          const index = classes.indexOf(cls);
          if (index === -1) { classes.push(cls); }
        });
      }
    } else {
      Logger.of('TplElement.getStylingOf').warn('getClasses is not a function', name);
    }
  });
  if (pos && typeof positions[pos] !== 'undefined') {
    const styleFromPos = positions[pos].getPositionStyles(props);
    Object.keys(styleFromPos).forEach((k) => {
      if (typeof styleFromPos[k] !== 'undefined') styles[k] = styleFromPos[k];
    });
    const classesFromPos = positions[pos].getPositionClasses(props);
    classesFromPos.forEach((cl) => { classes.push(cl); });
  }
  if (typeof childIndex !== 'undefined') { classes.push(`index-${childIndex}`); }
  const stylesData = props.if ? { ...styles, ...getStyleFromConditions(props, context) } : styles;
  return { styles: stylesData, classes };
};


export default { getStyling, getStylingProperties, checkProperties };
