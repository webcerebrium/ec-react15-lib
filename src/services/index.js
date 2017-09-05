import { Logger } from './Logger';
import { setValue, getValue, getEvaluated, getReadableValue, getWritableValue } from './DocumentData';
import { findById, searchElements, setValueById } from './DocumentTree';
import { renderChildren, renderElement } from './TplRenderer';
import { getStyling, getStylingProperties } from './TplStyling';

export {
  Logger,
  setValue,
  getValue,
  getReadableValue,
  getWritableValue,
  getEvaluated,
  getStyling,
  getStylingProperties,
  renderChildren,
  renderElement,
  findById
};

export default {
  Logger,
  setValue,
  getValue,
  getReadableValue,
  getWritableValue,
  getEvaluated,
  getStyling,
  getStylingProperties,
  renderChildren,
  renderElement,
  findById,
  searchElements,
  setValueById
};
