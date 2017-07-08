import { render } from 'react-dom';
import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Container } from './Container';

describe('html.Container', () => {
  it('is should work with empty container', () => {
    const props = { type: 'Container', container: [] };
    enableLogger(() => { Container({ props, context: {} }); });
    expectNoWarn();
  });
  it('is working without container', () => {
    const props = { type: 'Container' };
    enableLogger(() => { Container({ props, context: {} }); });
    expectNoWarn();
  });

  it('should be passing repeatable data to children', () => {
    let counter = 0;
    const MyDebug = ({ context }) => { counter += context.row.record; return false; };
    const ecOptions = { html: { MyDebug, Container } };
    const globals = { ecOptions };
    const repeatable = [{ record: 1 }, { record: 2 }];
    const props = { _id: 'sampleParentId', type: 'Container', repeatable, container: [{ type: 'MyDebug' }] };
    enableLogger(() => {
      const div = document.createElement(div);
      render(Container({ props, context: { globals } }), div);
    });
    expectNoWarn();
    expect(counter).toEqual(3);
  });

  it('should be passing dynamic repeatable data to children', () => {
    let counter = 0;
    const MyDebug = ({ context }) => { counter += context.row.record; return false; };
    const ecOptions = { html: { MyDebug, Container } };
    const globals = { ecOptions, source: [{ record: 11 }, { record: 22 }] };
    const props = {
      _id: 'sampleParentId', type: 'Container', '@repeatable': 'g:source', container: [{ type: 'MyDebug' }]
    };
    enableLogger(() => {
      const div = document.createElement(div);
      render(Container({ props, context: { globals } }), div);
    });
    expectNoWarn();
    expect(counter).toEqual(33);
  });
});
