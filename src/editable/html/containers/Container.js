import React from 'react';
import { Logger } from './../../../services/Logger';
import { renderChildren, getStyling } from './../../../services';
import './Container.css';

export const Container = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.Container').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const { styles, classes } = getStyling({
    props, context, pos, optional: ['container', 'repeatable', 'position'], styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;
  //
  const children = props.container ? renderChildren({ items: props.container, props, context }) : false;
  return (
    <div key={index} className={classes.join(' ')} style={styles}>{children}</div>
  );
};

export default {
  Container
};
