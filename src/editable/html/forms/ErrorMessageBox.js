import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

export const ErrorMessageBox = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.ErrorMessageBox').info('section', section, 'index', index, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, optional: ['value', 'alertType'], styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;
  //
  if (section === 'document') classes.push('container');
  const value = getValue(props, 'value', context);
  if (!value) return false; //and it is valid branch..
  // take the title from one of the documents?
  classes.push('alert');
  classes.push('alert-warning'); // use alertType instead
  return (
    <div key={index} className={classes.join(' ')} style={styles}>{value}</div>
  );
};

export default {
  ErrorMessageBox
};
