import { Logger } from './Logger';

export const trackPageview = (cb) => {
  Logger.of('Tracking.PageView').info('pageview');
  const callback = typeof cb === 'function' ? cb : (() => {});
  if (typeof window.ga === 'function') { window.ga('send', 'pageview'); } // eslint-disable-line
  callback();
};

/*
 * Callback on tracking event is a bit complex.
 * There is a possibility of timeout
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits
 */
export const trackEvent = ({ category, action, value }, cb) => {
  Logger.of('Tracking.Event').info('category=', category, 'action=', action, 'value=', value);
  const callback = typeof cb === 'function' ? cb : (() => {});
  if (typeof window.ga === 'function') { // eslint-disable-line
    let called = false;
    window.ga('send', 'event', category, action, value, { // eslint-disable-line
      hitCallback: () => {
        called = true;
        callback();
      }
    });
    setTimeout(() => { if (!called) { callback(); } }, 1000);
  } else {
    callback();
  }
};

export default {
  trackPageview,
  trackEvent
};
