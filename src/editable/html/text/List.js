import React from 'react';
import { Logger, getValue, getStyling } from './../../../services';

export const List = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.List').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['value'], optional: ['list'], styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;

  const tagName = props.list === 'unordered' ? 'ul' : 'ol';
  const lines = getValue(props, 'value', context).split('\n');
  return React.createElement(tagName, {
    className: classes.join(' '), key: index, style: styles
  }, lines.map((line, i) => (<li key={`line-${i}`}>{line}</li>))); // eslint-disable-line
};

export default {
  List
};
