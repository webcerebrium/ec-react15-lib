import { enableLogger, expectWarn, expectNoWarn } from './Logger.mock';
import { getValue } from './DocumentData';

describe('getValue', () => {
  it('should work read context.row', () => {
    const props = { '@src': 'row:images.original.path' };
    const row = { images: { original: { path: 'test' } } };
    enableLogger(() => {
      expect(getValue(props, 'src', { row })).toEqual('test');
    });
    expectNoWarn();
  });
  it('should work read context.row - with composition', () => {
    const props = { '@src': 'http://bit.ly/{{row:images.original.path}}' };
    const row = { images: { original: { path: 'test' } } };
    enableLogger(() => {
      expect(getValue(props, 'src', { row })).toEqual('http://bit.ly/test');
    });
    expectNoWarn();
  });
  it('should work read context.row - with constant index', () => {
    const props = { '@src': 'http://bit.ly/{{row:images[0].value}}' };
    const row = { images: [{ value: 'first'}, { value: 'second' }] };
    enableLogger(() => {
      expect(getValue(props, 'src', { row })).toEqual('http://bit.ly/first');
    });
    expectNoWarn();
  });
  it('should work read context.row - with constant index as the last field', () => {
    const props = { '@src': 'row:document.images[0]' };
    const row = { document: { images: ['first', 'second'] } };
    enableLogger(() => {
      expect(getValue(props, 'src', { row })).toEqual('first');
    });
    expectNoWarn();
  });

  /*it('should get document from dynamic reference', () => {
    const row = { id: 'documentB' };
    const docs = {
      documentA: { value: 'of A' },
      documentA: { value: 'of B' }
    };
    const props = { '@value': 'doc:{{row:id}}'};
    enableLogger(() => {
      expect(getValue(props, 'value', { docs, row })).toEqual('');
    });
    expectNoWarn();
  });*/
});

