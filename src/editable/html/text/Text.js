import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

export const Text = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Text').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['value'], optional: [], styling: ['Inline', 'Text', 'Visibility']
  });
  if (styles === false) return false;
  //
  return (
    <span style={styles} className={classes.join(' ')} key={index}>
      {getValue(props, 'value', context)}
    </span>
  );
};

export default {
  Text
};
