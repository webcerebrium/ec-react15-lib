import React from 'react';
import { Logger } from './../../../services/Logger';
import { getStyling } from './../../../services';

export const Divider = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.Divider').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const { styles, classes } = getStyling({ props, context, pos, styling: ['Block', 'Visibility'] });
  if (styles === false) return false;
  //
  styles.width = '100%';
  const innerStyle = {
    margin: '0px auto',
    width: typeof props.width !== 'undefined' ? props.width : '100%',
    height: typeof props.height !== 'undefined' ? props.height : 2,
    background: props.color ? props.color : '#888'
  };
  return (
    <div key={index} rel='Divider' className={classes.join(' ')} style={styles}>
      <div style={innerStyle}></div>
    </div>
  );
};

export default {
  Divider
};
