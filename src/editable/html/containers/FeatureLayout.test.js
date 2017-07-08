import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { FeatureLayout } from './FeatureLayout';

describe('html.FeatureLayout', () => {
  it('is should work with empty top and bottom containers', () => {
    const props = { type: 'FeatureLayout', top: [], bottom: [] };
    enableLogger(() => { FeatureLayout({ props, context: {} }); });
    expectNoWarn();
  });
  it('is not working without top container', () => {
    const props = { type: 'FeatureLayout', bottom: [] };
    FeatureLayout({ props, context: {} });
    expectWarn();
  });
  it('is not working without bottom  container', () => {
    const props = { type: 'FeatureLayout', top: [] };
    FeatureLayout({ props, context: {} });
    expectWarn();
  });

});
