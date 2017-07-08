import React from 'react';
import { render } from 'react-dom';
import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Container } from './../../../editable/html/containers/Container';
import { FlexLayout } from './FlexLayout';

describe('html.FlexLayout', () => {
  it('is should work with empty container', () => {
    const props = { type: 'FlexLayout', container: [] };
    enableLogger(() => { FlexLayout({ props, context: {} }); });
    expectNoWarn();
  });
  it('is not working without container', () => {
    const props = { type: 'FlexLayout' };
    FlexLayout({ props, context: {} });
    expectWarn();
  });
  it('should receive flex parent styles', () => {
    const props = {
      type: 'FlexLayout', alignItems: 'center', alignContent: 'top', justifyContent: 'bottom', flexWrap: 'wrap',
    };
    const item = { type: 'Container', width: 100, container: [] };
    props.container = [item];
    const div = document.createElement('div');
    enableLogger(() => {
      const ecOptions = { html: { FlexLayout, Container } };
      const globals = { ecOptions };
      const context = { globals };
      render(<FlexLayout props={props} context={context} />, div);
      const parentStyle = div.children[0].style;
      expect(parentStyle.display).toEqual('flex');
      expect(parentStyle.alignItems).toEqual('center');
      expect(parentStyle.justifyContent).toEqual('bottom');
      expect(parentStyle.alignContent).toEqual('top');
      expect(parentStyle.flexWrap).toEqual('wrap');
    });
    expectNoWarn();
  });

  it('its children could have flex property', () => {
    const item1 = { type: 'Container', flex: 1, container: [] };
    const item2 = { type: 'Container', width: 100, container: [] };
    const props = { type: 'FlexLayout', container: [item1, item2] };
    const div = document.createElement('div');
    enableLogger(() => {
      const ecOptions = { html: { FlexLayout, Container } };
      const globals = { ecOptions };
      const context = { globals };
      render(<FlexLayout props={props} context={context} />, div);
      const parentStyle = div.children[0].style;
      expect(parentStyle.display).toEqual('flex');
      const child1 = div.children[0].children[0];
      expect(child1.style.flex).toBeDefined();
      expect(child1.style.flex).not.toEqual('');
      expect(child1.style.flex).not.toEqual(false);
      expect(child1.style.flex).not.toEqual(null);
      const child2 = div.children[0].children[1];
      expect(child2.style.flex).toBeUndefined();
    });
    // expectWarn();
  });
});
