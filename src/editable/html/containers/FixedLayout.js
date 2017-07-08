import React from 'react';
import { Logger, renderChildren, getStyling } from './../../../services';

export const FixedLayout = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.FixedLayout').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const styling = ['Block', 'Fixed', 'Visibility'];
  const { styles, classes } = getStyling({
    props, context, pos, mandatory: ['container'], optional: ['repeatable', 'zIndex'], styling
  });
  if (styles === false) return false;
  //
  styles.position = 'fixed';
  if (props.zIndex) styles.zIndex = props.zIndex;
  // note: fixed layout doesn't influence on chilren - it is about fixing its position only
  // see freelayout instead if you are seeking for children with absolute coordinates
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      {renderChildren({ items: props.container, props, context })}
    </div>
  );
};

export default { FixedLayout };
