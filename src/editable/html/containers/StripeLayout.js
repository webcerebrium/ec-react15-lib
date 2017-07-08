import React from 'react';
import { Logger, renderChildren, getStyling } from './../../../services';

export const StripeLayout = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.StripeLayout').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const arrTopSections = ['document', 'header', 'footer'];
  if (arrTopSections.indexOf(section) === -1) {
    // warning if this element is in a wrong section
    Logger.of('render.StripeLayout')
      .warn('Cannot render stripe Layout outside of top sections. Only header, footer and document are allowed');
    return false;
  }
  const { styles, classes } = getStyling({
    props, context, pos, mandatory: ['container'], optional: ['repeatable'], styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;
  classes.push('container');
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      {renderChildren({ items: props.container, props, context })}
    </div>
  );
};

export default { StripeLayout };
