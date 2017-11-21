import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { YouTubeVideo } from './YouTubeVideo';

describe('html.YouTubeVideo', () => {
  it('should work ', () => {
    const props = { type: 'YouTubeVideo', videoId: '#' };
    enableLogger(() => { YouTubeVideo({ props, context: {} }); });
    expectNoWarn();
  });
  it('not working without videoId', () => {
    const props = { type: 'YouTubeVideo' };
    YouTubeVideo({ props, context: {} });
    expectWarn();
  });
});
