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

export const renderElement = (section, key, element, context, parent, pos) => {
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
    const params = { section, key, index: key, props: element, context, parent, pos };
    Logger.of('TplRenderer.renderElement').info(element.type, element);
    return React.createElement(elementsList[element.type], params);
  }
  Logger.of('TplRenderer.renderElement').warn('element type not found', element, 'list=', Object.keys(elementsList));
  return renderElementDebug({ key, section, element });
};

const renderElementsContainer = (section, elements, context, parent, pos) => {
  if (!elements) return false;
  return elements.map((item, index) => {
    return renderElement(section, index, item, context, parent, pos);
  });
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
    const rowsetPrefix = context.rowset ? `${context.rowset} ` : '';
    p.repeatable.forEach((row, dataIndex) => {
      // shouldn't row be evaluated? now. it shouldn't. we already have evaluation in repeated.
      const rowset = `${rowsetPrefix}${props._id}__${dataIndex}`;
      const rContext = { ...context, row: { ...context.row, ...row }, rowset };
      items.forEach((item, ri) => {
        const rIndex = ri + (dataIndex * items.length);
        repeatedItems.push(renderElement('container', rIndex, item, rContext, p, pos));
      });
    });
    return (repeatedItems);
  }
  return renderElementsContainer('container', items, context, props, pos);
};

export const renderDocument = (template, layout, context) => {
  const parent = { type: 'DocumentRoot' };
  if (layout && layout.container) {
    Logger.of('TplRenderer.renderDocument').warn('invalid layout, should not contain container parameter', layout);
    return false;
  }
  return (
    <div className='document wrapper'>
      {layout && layout.sticky ? renderElementsContainer('sticky', layout.sticky, context, parent) : ''}
      {layout && layout.header ? renderElementsContainer('header', layout.header, context, parent) : ''}
      {template && template.container ? renderElementsContainer('document', template.container, context, parent) : ''}
      {layout && layout.footer ? renderElementsContainer('footer', layout.footer, context, parent) : ''}
    </div>
  );
};

export default {
  renderElementDebug,
  renderElement,
  renderChildren,
  renderDocument
};
