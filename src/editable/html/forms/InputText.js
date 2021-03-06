import React from 'react';
import { TextArea, TextInput } from './../../../components';
import { triggerAction } from './../../../services/DocumentAction';
import Debounced from './../../../services/Debounced';
import { Logger, setValue, getWritableValue, getStyling, getValue } from './../../../services';

export const InputText = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.InputText').info('section', section, 'index', index, 'props', props, 'pos=', pos);
  const sp = { props, context, pos, childIndex };
  const optional = ['value', 'placeholder', 'readOnly', 'width', 'rows', 'maxLength', 'name', 'onChange', 'tracking'];
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['target'], optional, styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;
  //
  const value = getWritableValue(props.target, context, '');
  const isReadOnly = getValue(props, 'readOnly', context, false) === 'true';
  const nDebouncedInterval = props.debounce || 250;
  const onChangeValue = (val) => {
    Debounced.start(`update-${props.target}`, () => {
      setValue(props.target, val, context);
      if (props.onChange) {
        triggerAction(props.onChange, context);
      }
      if (typeof context.onTriggerComplete === 'function') {
        context.onTriggerComplete();
      }
    }, nDebouncedInterval);
  };
  if (props.rows > 1) {
    return (
      <TextArea
        placeholder={props.placeholder}
        style={styles}
        readOnly={isReadOnly}
        className={classes.join(' ')}
        rows={props.rows}
        value={value}
        name={props.name}
        onChange={onChangeValue}
        maxLength={props.maxLength}
      />
    );
  }
  return (
    <TextInput
      placeholder={props.placeholder}
      style={styles}
      readOnly={isReadOnly}
      className={classes.join(' ')}
      value={value}
      name={props.name}
      onChange={onChangeValue}
      maxLength={props.maxLength}
    />
  );
};

export default { InputText };
