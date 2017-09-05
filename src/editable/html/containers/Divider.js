import React from 'react';
import { Logger } from './../../../services/Logger';
import { getStyling } from './../../../services';

export const Divider = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Divider').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({ ...sp, styling: ['Block', 'Visibility'] });
  if (styles === false) return false;
  //
  styles.width = '100%';
  const innerStyle = {
    margin: '0px auto',
    width: props.width ? props.width : '100%',
    height: props.height ? props.height : 2,
    background: props.borderColor ? props.borderColor : '#888',
    float: props.textAlign ? props.textAlign : 'none'
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
