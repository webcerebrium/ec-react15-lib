import React from 'react';
import * as commonHtmlIndex from './../editable/html';
import { Logger } from './Logger';
import { getEvaluated } from './DocumentData';

export const renderElementDebug = ({ key, section, element }) => (
  <div key={key} style={{ borderBottom: '1px #eee solid', margin: 5 }}>
    <div style={{ background: '#f88', color: 'white' }}>
      {section}
    </div>
    <pre>{JSON.stringify(element, null, 2)}</pre>
  </div>
);

export const renderElement = (section, key, element, context, parent, pos, childIndex) => {
  const type = element.type;
  if (!type) {
    Logger.of('TplRenderer.renderElement').warn('element type not defined', element);
    return renderElementDebug();
  }
  // if (type === 'Image') { Logger.of('TplRenderer.renderElement').warn('Image', element); };
  const elementsList = { ...commonHtmlIndex.default };
  if (context.globals && context.globals.ecOptions && context.globals.ecOptions.html) {
    const html = context.globals.ecOptions.html;
    Object.keys(html).forEach((k) => { elementsList[k] = html[k]; });
  }
  if (typeof elementsList[element.type] === 'function') {
    // There could be some properties added.
    const params = { section, key, index: key, props: element, context, parent, pos, childIndex };
    Logger.of('TplRenderer.renderElement').info(element.type, element);
    return React.createElement(elementsList[element.type], params);
  }
  Logger.of('TplRenderer.renderElement').warn('element type not found', element, 'list=', Object.keys(elementsList));
  return renderElementDebug({ key, section, element });
};

const renderElementsContainer = (docId, section, elements, context, parent, pos) => {
  if (!elements) return false;
  if (!docId) {
    return elements.map((item, index) => (renderElement(section, index, item, context, parent, pos)));
  }
  return (
    <div key={section} data-document={docId}>
      {elements.map((item, index) => (renderElement(section, index, item, context, parent, pos)))}
    </div>
  );
};

/* This method returns HTMLCollection */
export const renderChildren = (params) => {
  const { items, props, context, parent, pos } = params;
  // there should be no parent
  if (parent) {
    Logger.of('TplRenderer.renderChildren').warn('parent parameter is not allowed as parameter', props);
    return false;
  }
  if (!props) {
    Logger.of('TplRenderer.renderChildren').warn('props parameter is missing', props);
    return false;
  }
  const p = getEvaluated(props, context);
  if (p.repeatable) {
    if (!props._id) {
      Logger.of('TplRenderer.renderChildren').warn('repeatable elements require _id', props);
      return false;
    }
    const repeatedItems = [];
    p.repeatable.forEach((row, dataIndex) => {
      // shouldn't row be evaluated? no. it shouldn't. we already have evaluation in repeated.
      const rContext = { ...context, row: { ...context.row, ...row } };
      items.forEach((item, ri) => {
        const rIndex = ri + (dataIndex * items.length);
        repeatedItems.push(renderElement('container', rIndex, item, rContext, p, pos, dataIndex));
      });
    });
    return (repeatedItems);
  }
  return renderElementsContainer('', 'container', items, context, props, pos);
};

export const renderDocument = (template, layout, context) => {
  const parent = { type: 'DocumentRoot' };
  if (layout && layout.container) {
    Logger.of('TplRenderer.renderDocument').warn('invalid layout, should not contain container parameter', layout);
    return false;
  }
  const out = [];
  if (layout) {
    if (layout.sticky) out.push(renderElementsContainer(layout._id, 'sticky', layout.sticky, context, parent));
    if (layout.header) out.push(renderElementsContainer(layout._id, 'header', layout.header, context, parent));
  }
  if (template && template.container) {
    out.push(renderElementsContainer(template._id, 'document', template.container, context, parent));
  }
  if (layout && layout.footer) {
    out.push(renderElementsContainer(layout._id, 'footer', layout.footer, context, parent));
  }
  return out;
};

export default {
  renderElementDebug,
  renderElement,
  renderChildren,
  renderDocument
};
