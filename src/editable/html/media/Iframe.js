import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

/*eslint-disable jsx-a11y/iframe-has-title*/

export const Iframe = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Iframe').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp,
    mandatory: ['src'],
    optional: ['frameBorder'],
    styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;
  //

  const src = getValue(props, 'src', context);
  if (!src) return false;
  return (<iframe style={styles} className={classes.join(' ')} src={src}></iframe>);
};

export default { Iframe };
