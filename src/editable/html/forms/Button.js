import React from 'react';
import { triggerAction } from './../../../services/DocumentAction';
import { Logger, getValue, renderChildren, getStyling } from './../../../services';

export const Button = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Button').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const optional = ['disabled', 'value', 'container', 'icon', 'iconSide', 'tracking'];
  const { styles, classes } = getStyling({
    ...sp, optional, mandatory: ['actions'], styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;
  //
  styles.cursor = 'pointer';
  const disabled = getValue(props, 'disabled', context); // disabled could be conditional, from styles...
  const isDisabled = typeof styles.disabled !== 'undefined' ? styles.disabled : disabled;
  const onClick = () => {
    Logger.of('event.Button').info('Button was clicked', props, 'context=', context);
    if (!isDisabled) triggerAction(props, context);
  };
  const iconSide = props.iconSide || 'left';
  const leftIcon = iconSide !== 'right' && props.icon ?
  (<span>&nbsp; <i className={`fa fa-${props.icon}`} /></span>) : false;
  const rightIcon = iconSide === 'right' && props.icon ?
  (<span>&nbsp; <i className={`fa fa-${props.icon}`} /></span>) : false;
  return (
    <button disabled={isDisabled} key={index} className={classes.join(' ')} style={styles} onClick={onClick}>
      {getValue(props, 'value', context)}
      {leftIcon}
      {!props.container ? false : renderChildren({ items: props.container, props, context })}
      {rightIcon}
    </button>
  );
};

export default { Button };
