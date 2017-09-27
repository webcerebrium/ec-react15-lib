import { Logger } from './Logger';
import { setValue, getValue, getEvaluated, getReadableValue, getWritableValue } from './DocumentData';
import { findById, searchElements, setValueById } from './DocumentTree';
import { renderChildren, renderElement } from './TplRenderer';
import { getStyling, getStylingProperties } from './TplStyling';
import Debounced from './Debounced';

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
  findById,
  Debounced
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
  setValueById,
  Debounced
};
