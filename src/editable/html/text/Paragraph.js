import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

export const Paragraph = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.List').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['value'], optional: [], styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;

  const getIndex = (item, i) => (i);
  const value = getValue(props, 'value', context);
  if (typeof value !== 'string') {
    Logger.of('render.Paragraph').warn('Could not render Paragraph - invalid value type provided', 'value=', value);
    return false;
  }
  return (
    <div style={styles} className={classes.join(' ')}>
      {value.split('\n').map((item, i) => (<p key={getIndex(item, i)}>{item}</p>))}
    </div>
  );
};

export default {
  Paragraph
};
