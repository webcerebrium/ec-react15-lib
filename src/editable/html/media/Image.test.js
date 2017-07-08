import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { Image } from './Image';

describe('html.Image', () => {
  it('should work ', () => {
    const props = { type: 'Image', src: '#', title: '' };
    enableLogger(() => { Image({ props, context: {} }); });
    expectNoWarn();
  });
  it('not working without src', () => {
    const props = { type: 'Image' };
    Image({ props, context: {} });
    expectWarn();
  });
});
