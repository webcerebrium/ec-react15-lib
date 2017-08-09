import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

export const Image = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.Image').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['src'], optional: ['title', 'sizes', 'srcSet'], styling: ['Inline', 'Visibility']
  });
  if (styles === false) return false;
  //
  const src = getValue(props, 'src', context);
  if (typeof src === 'undefined') {
    Logger.of('render.html.Image').info('Image is missing src property, props=', props, 'context=', context);
    return false;
  }
  if (!src) return false;
  return (
    <img
      rel={props.rowset}
      style={styles}
      className={classes.join(' ')}
      src={src}
      sizes={props.sizes}
      srcSet={props.srcset}
      alt={getValue(props, 'title', context)}
    />
  );
};

export default { Image };
