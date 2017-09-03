import React from 'react';
import { Logger, getValue, renderChildren, getStyling } from './../../../services';
import { triggerAction } from './../../../services/DocumentAction';

export const Link = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Link').info('section', section, 'index', index, 'props', props, 'context=', context);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp,
    styling: ['Inline', 'Text', 'Visibility'],
    mandatory: ['href'],
    optional: ['actions', 'target', 'icon', 'iconSide', 'container', 'value', 'textAlign', 'tracking']
  });
  if (styles === false) return false;
  if (props.textAlign) styles.textAlign = props.textAlign; // weird..

  const onClick = (e) => {
    Logger.of('render.html.Link.onClick').info('Link was clicked', props, 'context=', context);
    e.preventDefault();
    e.stopPropagation();
    triggerAction(props, context);
  };
  const iconSide = props.iconSide || 'left';
  const value = getValue(props, 'value', context);
  const leftIcon = iconSide !== 'right' && props.icon ? <i className={`fa fa-${props.icon}`} /> : false;
  const rightIcon = iconSide === 'right' && props.icon ? <i className={`fa fa-${props.icon}`} /> : false;
  const target = getValue(props, 'target', context);
  const hasHash = target === 'inherit' && context.globals.websiteType === 'webapp-config';
  const href = (hasHash ? '#' : '') + getValue(props, 'href', context);
  return (
    <a
      key={index}
      href={href}
      className={classes.join(' ')}
      style={styles}
      target={target !== 'inherit' ? target : undefined}
      onClick={props.actions && onClick}
    >
      {leftIcon}
      {value && leftIcon ? <span>&nbsp;</span> : false}
      {value}
      {!props.container ? false : renderChildren({ items: props.container, props, context })}
      {value && rightIcon ? <span>&nbsp;</span> : false}
      {rightIcon}
    </a>
  );
};

export default { Link };
