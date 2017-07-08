// this module is used so far to run

// import React from 'react';
// import { Logger } from './Logger';

export const findDocumentElements = (selector, doc) => {
  if (!selector || !doc) return null;
  return doc.querySelector(selector);
};

export default {
  findDocumentElements
};
