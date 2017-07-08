import React from 'react';
import { Logger } from './../../../services/Logger';
import { renderChildren, getStyling } from './../../../services';

export const FlexLayout = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.FlexLayout').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['container'], optional: ['repeatable'], styling: ['Block', 'FlexParent', 'Visibility']
  });
  if (styles === false) return false;
  //
  if (styles.display !== 'none') styles.display = 'flex';
  //
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      {renderChildren({ items: props.container, props, context, pos: 'FlexChild' })}
    </div>
  );
};

export default { FlexLayout };
