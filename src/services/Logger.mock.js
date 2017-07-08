import { Logger } from './Logger';

export const expectNoErrors = () => { expect(Logger.calls.error).toEqual(0); };
export const expectNoWarn = () => { expect(Logger.calls.warn).toEqual(0); expectNoErrors(); };
export const expectErrors = () => { expect(Logger.calls.error).toBeGreaterThan(0); };
export const expectWarn = () => { expect(Logger.calls.warn).toBeGreaterThan(0); };
export const enableLogger = (wrapper) => {
  if (typeof wrapper === 'function') {
    Logger.calls.warn = 0;
    Logger.calls.error = 0;
    Logger.setOption('output', true);
    wrapper();
    Logger.setOption('output', false);
  } else {
    Logger.setOption('output', wrapper);
  }
};

export default {
  enableLogger, expectNoErrors, expectErrors, expectNoWarn, expectWarn
};
