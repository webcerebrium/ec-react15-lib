import React from 'react';
import { render } from 'react-dom';
import { enableLogger, expectWarn, expectNoWarn } from './../../../services/Logger.mock';
import { InputImageUpload } from './InputImageUpload';

describe('html.InputImageUpload', () => {
  it('is should work', () => {
    const props = { type: 'InputImageUpload', target: 'g:data', onUpload: {} };
    const globals = { data: false };
    enableLogger(() => {
      const div = document.createElement('div');
      render(<InputImageUpload props={props} context={{ globals }} />, div);
    });
    expectNoWarn();
  });
});
