import React from 'react';
import { render } from 'react-dom';
import { enableLogger, expectWarn, expectNoWarn } from './Logger.mock';
import { renderElementDebug, renderElement, renderDocument, renderChildren } from './TplRenderer';

describe('renderElementDebug', () => {
  it('should work', () => {
    const div = document.createElement('div');
    const element = { any: 'object' };
    enableLogger(() => {
      render(renderElementDebug({section: 'container', key: 0, element}), div);
    });
    expectNoWarn();
  });
});

describe('renderElement', () => {
  it('should work', () => {
    const element = { type: 'Text', value: '...' };
    const parent = { type: 'MockParent' };
    enableLogger(() => {
      renderElement('container', 0, element, {}, parent);
    });
    expectNoWarn();
  });
});

describe('renderDocument', () => {
  it('should work without layout', () => {
    const template = { container: [] };
    enableLogger(() => {
      renderDocument(template, false, {});
    });
    expectNoWarn();
  });
  it('should not work with invalid layout', () => {
    const template = { container: [] };
    const layout = { container: [] };
    renderDocument(template, layout, {});
    expectWarn();
  });
});

describe('renderChildren', () => {
  it('should work with no children', () => {
    const props = { type: 'Text', value: '...' };
    enableLogger(() => {
      const div = document.createElement('div');
      const children = renderChildren({ items: [], props, context: {} });
    });
    expectNoWarn();
  });

  const items = [
    { type: 'Text', value: 'First'},
    { type: 'Header', value: 'Second'},
    { type: 'Paragraph', value: 'Third'}
  ];
  it('should work with static children', () => {
    const props = { type: 'Container' };
    enableLogger(() => {
      ///const div = document.createElement('div');
      const children = renderChildren({ items, props, context: {} });
      expect(children.length).toEqual(3);
      // render(children, div);
    });
    expectNoWarn();
  });

  it('should work with zero repeatable children', () => {
    const props = { type: 'Container', repeatable: [], _id: 'sampleId' };
    enableLogger(() => {
      // const div = document.createElement('div');
      const children = renderChildren({ items, props, context: {} })
      expect(children.length).toEqual(0);
      // render(children, div);
    });
    expectNoWarn();
  });

  it('should not work with repeatable children without _id', () => {
    const props = { type: 'Container', repeatable: [] };
    renderChildren({ items, props, context: {} });
    expectWarn();
  });

  it('should work with some repeatable children', () => {
    const repeatable = [{}, {}];
    const props = { type: 'Container', repeatable, _id: 'sampleId' };
    enableLogger(() => {
      const children = renderChildren({ items, props, context: {} });
      // const div = document.createElement('div');
      // const out = render(children, div);
      expect(children.length).toEqual(6);
    });
    expectNoWarn();
  });
});
