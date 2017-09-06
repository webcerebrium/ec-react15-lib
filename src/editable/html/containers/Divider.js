import React from 'react';
import { Logger } from './../../../services/Logger';
import { getStyling } from './../../../services';

export const Divider = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Divider').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({ ...sp, styling: ['Block', 'Visibility'] });
  if (styles === false) return false;
  styles.width = '100%';
  styles.fontSize = 0;
  if (!props.textAlign) {
    styles.textAlign = 'center';
  }
  const innerStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: props.width ? props.width : '100%',
    height: props.height ? props.height : 2,
    background: props.borderColor ? props.borderColor : '#888'
  };
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      <div style={innerStyle}></div>
    </div>
  );
};

export default {
  Divider
};
