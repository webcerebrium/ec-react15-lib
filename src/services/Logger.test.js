import { expectNoWarn } from './Logger.mock';
import { Logger, componentMatchesLevel, isLevelEnabled, isComponentMatch } from './Logger';

// what is visible on info, should not be visible on warn
describe('Logger', () => {
  it('should be executed without Logger warning or errors', () => {
    Logger.of('logger.test').info('example');
    expectNoWarn();
  });
});

describe('isLevelEnabled', () => {
  it('if x is enabled, x is enabled', () => {
    expect(isLevelEnabled('TRACE', 'TRACE')).toEqual(true);
    expect(isLevelEnabled('INFO', 'INFO')).toEqual(true);
    expect(isLevelEnabled('WARN', 'WARN')).toEqual(true);
    expect(isLevelEnabled('ERROR', 'ERROR')).toEqual(true);
  });
  it('if INFO is enabled, then TRACE is disabled', () => {
    expect(isLevelEnabled('INFO', 'TRACE')).toEqual(false);
  });
  it('if WARN is enabled, then TRACE, INFO are disabled', () => {
    expect(isLevelEnabled('WARN', 'TRACE')).toEqual(false);
    expect(isLevelEnabled('WARN', 'INFO')).toEqual(false);
  });
  it('if ERROR is enabled, then TRACE, INFO, WARN are disabled', () => {
    expect(isLevelEnabled('ERROR', 'TRACE')).toEqual(false);
    expect(isLevelEnabled('ERROR', 'INFO')).toEqual(false);
    expect(isLevelEnabled('ERROR', 'WARN')).toEqual(false);
  });
  it('if OFF is enabled, then all are disabled', () => {
    expect(isLevelEnabled('OFF', 'TRACE')).toEqual(false);
    expect(isLevelEnabled('OFF', 'INFO')).toEqual(false);
    expect(isLevelEnabled('OFF', 'WARN')).toEqual(false);
    expect(isLevelEnabled('OFF', 'ERROR')).toEqual(false);
  });
});

describe('isComponentMatch', () => {
  it('individual match works', () => {
    expect(isComponentMatch('c1.method', 'c1.method')).toEqual(true);
  });
  it('wrong individual that should not match', () => {
    expect(isComponentMatch('c1.method', 'c1.method2')).toEqual(false);
  });
  it('parent match works', () => {
    expect(isComponentMatch('c1.method', 'c1')).toEqual(true);
  });
  it('parent match that should not work', () => {
    expect(isComponentMatch('c1.method', 'c1.another')).toEqual(false);
  });
  it('grand parent match works', () => {
    expect(isComponentMatch('c1.method.sub', 'c1')).toEqual(true);
  });
})

describe('componentMatchesLevel', () => {
  const mapMethods = {
    'c1': 'ERROR',
    'c1.method1': 'OFF',
    'c1.method1.secondlevel': 'WARN',
    'c1.method2': 'INFO',
    'c1.method2.secondlevel': 'OFF',
    'c1.method3': 'WARN',
    'c2.func2': 'TRACE',
    'c3.getterFunc0': 'TRACE'
  };
  it('warning expected on full match', () => {
    expect(componentMatchesLevel('c1.method3', 'WARN', mapMethods)).toEqual(true);
    expect(componentMatchesLevel('c1.method3', 'TRACE', mapMethods)).toEqual(false);
    expect(componentMatchesLevel('c1.method3', 'INFO', mapMethods)).toEqual(false);
    expect(componentMatchesLevel('c1.method3', 'ERROR', mapMethods)).toEqual(true);
  });
  it('error expected on parent match', () => {
    expect(componentMatchesLevel('c1.method4', 'ERROR', mapMethods)).toEqual(true);
    expect(componentMatchesLevel('c1.method4', 'TRACE', mapMethods)).toEqual(false);
    expect(componentMatchesLevel('c1.method4', 'INFO', mapMethods)).toEqual(false);
    expect(componentMatchesLevel('c1.method4', 'WARN', mapMethods)).toEqual(false);
  });
});
