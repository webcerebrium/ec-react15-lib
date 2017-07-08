import React from 'react';
import { render } from 'react-dom';
import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { InputFileUpload } from './InputFileUpload';

describe('html.InputFileUpload', () => {
  it('is should work with no options', () => {
    const props = { type: 'InputFileUpload', target: 'g:data', options: [] };
    const globals = { data: false };
    enableLogger(() => {
      const div = document.createElement('div');
      render(<InputFileUpload props={props} context={{ globals }} />, div);
    });
    expectNoWarn();
  });
});
