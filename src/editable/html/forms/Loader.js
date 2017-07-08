import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';
import './Loader.css';

export const Loader = ({ section, index, props, context, pos }) => {
  Logger.of('render.Loader').info('section', section, 'index', index, 'pos', pos);
  const sp = { props, context, pos };
  const { styles, classes } = getStyling({
    ...sp, optional: ['color', 'size'], styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;
  const color = getValue(props, 'color', context, '#29d'); // add styled component for support of color
  const size = getValue(props, 'size', context, 30);
  styles.width = size;
  styles.height = size;

  classes.push('pace');
  classes.push('pace-active');
  const styleActivity = {
    left: (size - 14) / 2,
    top: (size - 14) / 2,
    width: 14,
    height: 14,
    border: 'solid 2px transparent',
    borderTopColor: color,
    borderLeftColor: color,
    borderRadius: 10
  };
  return (
    <div className={classes.join(' ')} style={styles}>
      <div className='pace-activity' style={styleActivity}></div>
    </div>
  );
};

export default { Loader };
