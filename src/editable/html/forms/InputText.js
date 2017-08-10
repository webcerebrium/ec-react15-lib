import React from 'react';
import { TextArea, TextInput } from './../../../components';
import { triggerAction } from './../../../services/DocumentAction';
import { Logger, setValue, getWritableValue, getStyling } from './../../../services';

export const InputText = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.InputText').info('section', section, 'index', index, 'props', props, 'pos=', pos);
  const sp = { props, context, pos, childIndex };
  const optional = ['value', 'placeholder', 'width', 'rows', 'maxLength', 'name', 'onChange'];
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['target'], optional, styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;
  //
  const value = getWritableValue(props.target, context, '');
  const onChangeValue = (val) => {
    setValue(props.target, val, context);
    if (props.onChange) {
      triggerAction(props.onChange, context);
    }
    if (typeof context.onTriggerComplete === 'function') { context.onTriggerComplete(); }
  };
  if (props.rows > 1) {
    return (
      <TextArea
        placeholder={props.placeholder}
        style={styles}
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
      className={classes.join(' ')}
      value={value}
      name={props.name}
      onChange={onChangeValue}
      maxLength={props.maxLength}
    />
  );
};

export default { InputText };
