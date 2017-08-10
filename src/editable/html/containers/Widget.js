import React from 'react';
import { Logger } from './../../../services/Logger';
import { deepSet } from './../../../services/DocumentObject';
import { getReadableValue, renderChildren, getStyling } from './../../../services';

export const Widget = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.html.Widget').info('section', section, 'index', index, 'props', props, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const optional = ['mappedData', 'mappedDocuments', 'repeatable'];
  const { styles, classes } = getStyling({
    ...sp, styling: ['Block', 'Visibility'], mandatory: ['document', '_id'], optional
  });
  if (styles === false) return false;
  //
  if (!context.docs) {
    Logger.of('render.html.Widget').error('Widget instance is context.docs - check reducers', props, context);
    return false;
  }
  const widgetDoc = context.docs[props.document];
  if (!widgetDoc) {
    Logger.of('render.html.Widget').error('Widget instance is missing document in context', props, context);
    return false;
  }
  // map target properties
  const row = { ...context.row };
  if (props.mappedData) {
    Object.keys(props.mappedData).forEach((key) => {
      if (key.substring(0, 1) !== '@') {
        const newValue = props.mappedData[key];
        deepSet(row, key, newValue);
      } else {
        const pureKey = key.substring(1);
        const newValue = getReadableValue(props.mappedData[key], context);
        deepSet(row, pureKey, newValue);
      }
    });
  }
  if (props.mappedDocuments) {
    Object.keys(props.mappedDocuments).forEach((key) => {
      if (key.substring(0, 1) !== '@') {
        const documentIndex = props.mappedDocuments[key];
        deepSet(row, key, context.docs[documentIndex]);
      } else {
        const pureKey = key.substring(1);
        const documentIndex = getReadableValue(props.mappedDocuments[key], context);
        deepSet(row, pureKey, context.docs[documentIndex]);
      }
    });
  }
  const p = { ...props };
  if (widgetDoc['@repeatable']) p['@repeatable'] = widgetDoc['@repeatable'];
  else if (widgetDoc.repeatable) p.repeatable = widgetDoc.repeatable;
  const template = widgetDoc._id;
  return (
    <div key={index} className={classes.join(' ')} style={styles} data-document={template}>
      {renderChildren({ items: widgetDoc.container, props: p, context: { ...context, row } })}
    </div>
  );
};

export default {
  Widget
};
