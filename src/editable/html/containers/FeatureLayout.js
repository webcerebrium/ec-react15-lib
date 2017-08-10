import React from 'react';
import { Logger } from './../../../services/Logger';
import { renderChildren, getStyling } from './../../../services';

export const FeatureLayout = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.FeatureLayout').info('section', section, 'index', index, 'props', props);
  const sp = { props, context, pos, childIndex };
  const optional = ['orientation', 'repeatable', 'alignSelf'];
  const alignSelf = props.alignSelf || 'center';
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['top', 'bottom'], optional, styling: ['Block', 'FlexParent', 'Visibility']
  });
  if (styles === false) return false;
  //
  const hasSplit = context.browser && !(context.browser.lessThan.md);
  const left = props.orientation === 'left' ? (props.top || []) : (props.bottom || []);
  const right = props.orientation === 'left' ? (props.bottom || []) : (props.top || []);
  if (hasSplit) {
    styles.display = 'flex';
    return (
      <div key={index} className={classes.join(' ')} style={styles}>
        <div style={{ flex: 1, width: '48%', alignSelf, padding: '1%' }}>
          {renderChildren({ items: left, props, context })}
        </div>
        <div style={{ flex: 1, width: '48%', alignSelf, padding: '1%' }}>
          {renderChildren({ items: right, props, context })}
        </div>
      </div>
    );
  }
  return (
    <div key={index} className={classes.join(' ')} style={styles}>
      {renderChildren({ items: props.top, props, context })}
      {renderChildren({ items: props.bottom, props, context })}
    </div>
  );
};

export default { FeatureLayout };
