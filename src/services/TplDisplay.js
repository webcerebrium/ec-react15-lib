import React from 'react';
import { Logger } from './Logger';
import { matchConditions, getStyleFromConditions } from './DocumentCondition';

export const getConditionalStyles = getStyleFromConditions;

export const getDisplayClasses = (props, context) => {
  if (!props) return [];
  const arrClasses = [];
  if (props._id) arrClasses.push(`id-${props._id}`);
  //if (props.class) arrClasses.push(props.class);
  const display = props.display;
  if (!display) return arrClasses;
  const when = display.when;
  if (!when || when === 'always') return arrClasses;
  if (when === 'never') { arrClasses.push('hidden'); return arrClasses; }
  // this way of responsive visibility is deprecated, conditional properties should be used.
  //if (when === 'responsive') {
  //  const screens = display.screens;
  //  if (screens) {
  //    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((device) => {
  //      if (screens.indexOf(device) === -1) { arrClasses.push(`hidden-${device}`); }
  //  });
  //  }
  //}
  if (when === 'if' && display.conditions && display.conditions.length) {
    if (!matchConditions(props, display.conditions, context)) {
      arrClasses.push('hidden');
    }
  }
  return arrClasses;
};

export const getDisplayStyles = (props, context) => {
  return {};
};

export const getPositionClasses = (position, context) => {
  if (!position) return [];
  const mapGridClasses = {
    xlColumn: 'col-xl',
    xlOffset: 'offset-xl',
    lgColumn: 'col-lg',
    lgOffset: 'col-lg-offset',
    mdColumn: 'col-md',
    mdOffset: 'offset-md',
    smColumn: 'col-sm',
    smOffset: 'offset-sm',
    xsColumn: 'col-xs',
    xsOffset: 'offset-xs'
  };
  const arrClasses = [];
  Object.keys(position).forEach((key) => {
    if (typeof mapGridClasses[key] !== 'undefined') {
      arrClasses.push(`${mapGridClasses[key]}-${position[key]}`);
    }
  });
  return arrClasses;
};

export const getPositionStyles = (position, context) => {
  return {};
};
