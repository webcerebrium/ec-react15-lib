import React from 'react';
import { Logger, renderChildren, getStyling } from './../../../services';

export const FreeLayout = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.FreeLayout').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const { styles, classes } = getStyling({
    props, context, parent, pos, mandatory: ['container'], optional: ['repeatable'], styling: ['Block', 'Visibility']
  });
  // Free and Fixed - should have same styling (zIndex, minHeight, height, maxHeight)
  if (styles === false) return false;
  styles.position = 'absolute';
  const innerStyle = { position: 'relative', width: '100%', height: props.height };
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      {renderChildren({ items: props.container, props, context, pos: 'Free' })}
    </div>
  );
};

export default { FreeLayout };
