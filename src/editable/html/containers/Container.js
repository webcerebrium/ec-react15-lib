import React from 'react';
import { Logger } from './../../../services/Logger';
import { renderChildren, getStyling } from './../../../services';
import './Container.css';

export const Container = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Container').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, optional: ['container', 'repeatable', 'position'], styling: ['Block', 'Visibility']
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
