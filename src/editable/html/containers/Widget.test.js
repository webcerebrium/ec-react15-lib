import { render } from 'react-dom';
import { Container } from './../../../editable/html/containers/Container';
import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Widget } from './Widget';
import { getValue } from './../../../services/DocumentData';

describe('html.Widget', () => {
  it('is working', () => {
    const docs = { '--Doc': { type: 'template', container: [] } };
    const props = { type: 'Widget', _id: 'sampleId', document: '--Doc' };
    enableLogger(() => { Widget({ props, context: { docs } }); });
    expectNoWarn();
  });
  it('is not mounting without _id', () => {
    const props = { type: 'Widget' };
    Widget({ props, context: {}, parent });
    expectWarn();
  });
  //it('is should be mounted with attribute, equal to _id', () => {
  //  const docs = { '--Doc': { type: 'template', container: [] } };
  //  const props = { type: 'Widget', _id: 'sampleId', document: '--Doc' };
  //  enableLogger(() => {
  //    const div = document.createElement(div);
  //    const res = render(Widget({ props, context: { docs } }), div);
  //    expect(res.getAttribute('rel')).toEqual('sampleId');
  //  });
  //  expectNoWarn();
  //});
  it('is not mounting without document', () => {
    const props = { type: 'Widget', _id: 'sampleId' };
    Widget({ props, context: {} });
    expectWarn();
  });
  it('is not working without document in the context', () => {
    const props = { type: 'Widget', _id: 'sampleId', document: '--Doc' };
    Widget({ props, context: {} });
    expectWarn();
  });

  it('should be passing static mappedData into the context.row', () => {
    const MyDebug = ({ context }) => {
      expect(context.row.source.one).toEqual('value'); return false;
    };
    const ecOptions = { html: { MyDebug, Widget, Container } };
    const docs = { '--Doc': { type: 'template', container: [{ type: 'MyDebug' }] } };
    const mappedData = { 'source': { one: 'value' } };
    const props = { _id: 'sampleParentId', type: 'Widget', document: '--Doc', mappedData };
    enableLogger(() => {
      const div = document.createElement(div);
      render(Widget({ props, context: { globals: { ecOptions }, docs } }), div);
    });
    expectNoWarn();
  });

  it('should be passing dynamic mappedData into the context.row', () => {
    const MyDebug = ({ context }) => {
      expect(context.row.source).toEqual(1114);
      return false;
    };
    const ecOptions = { html: { MyDebug, Widget, Container } };
    const globals = { ecOptions, temp: 1114 };
    const docs = { '--Doc': { type: 'template', container: [{ type: 'MyDebug' }] } };
    const mappedData = { '@source': 'g:temp' };
    const props = { _id: 'sampleParentId', type: 'Widget', document: '--Doc', mappedData };
    enableLogger(() => {
      const div = document.createElement(div);
      render(Widget({ props, context: {  globals, docs } }), div);
    });
    expectNoWarn();
  });

  it('should be mapping document with dynamic reference', () => {
    const MyDebug = ({ context }) => {
      expect(context.row.source).toEqual({ value: 'of B' }); return false;
    };
    const ecOptions = { html: { MyDebug, Widget, Container } };
    const globals = { ecOptions };
    const row = { id: 'documentB' };
    const docs = {
      '--Doc': { type: 'template', container: [{ type: 'MyDebug' }] },
      documentA: { value: 'of A' },
      documentB: { value: 'of B' }
    };
    const mappedDocuments = { '@source': 'row:id'};
    const props = { _id: 'sampleParentId', type: 'Widget', document: '--Doc', mappedDocuments };

    enableLogger(() => {
      const div = document.createElement(div);
      render(Widget({ props, context: { globals, row, docs } }), div);
    });
    expectNoWarn();
  });

  it('should be passing repeatable in template to children', () => {
    let callsCounter = 0;
    const MyDebug = ({ context }) => { callsCounter ++; return false; };
    const ecOptions = { html: { MyDebug, Widget, Container } };
    const globals = { ecOptions };
    const repeatable = [{ record: 1 }, { record: 2 }];
    const docs = { '--Doc': { type: 'template', repeatable, container: [{ type: 'MyDebug' }] } };
    const props = { _id: 'sampleParentId', type: 'Widget', document: '--Doc' };
    enableLogger(() => {
      const div = document.createElement(div);
      render(Widget({ props, context: { globals, docs } }), div);
    });
    expectNoWarn();
    expect(callsCounter).toEqual(2);
  });
})
