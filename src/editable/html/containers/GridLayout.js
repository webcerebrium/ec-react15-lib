import React from 'react';
import { Logger, getStyling, renderChildren } from './../../../services';
import './GridLayout.css';

export const GridLayout = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.GridLayout').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['container'], optional: ['repeatable'], styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;
  //
  const arrTopContext = ['document', 'header', 'footer'];
  if (arrTopContext.indexOf(section) !== -1) {
    classes.push('container'); // else we are not in the top of hierarchy
  }
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      <div className='row'>
        {renderChildren({ items: props.container, props, context, pos: 'Grid' })}
      </div>
    </div>
  );
};

export default { GridLayout };
