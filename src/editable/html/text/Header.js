import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

export const Header = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Header').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['value'], optional: ['header'], styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;
  //
  const tagName = props.header ? props.header : 'h1';
  return React.createElement(tagName, { className: classes.join(' '), key: index, style: styles },
    getValue(props, 'value', context));
};

export default { Header };
