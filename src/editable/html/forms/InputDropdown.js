import React from 'react';
import { Dropdown } from './../../../components';
import { triggerAction } from './../../../services/DocumentAction';
import { Logger, setValue, getValue, getWritableValue, getStyling } from './../../../services';

export const InputDropdown = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.InputDropdown').info('section', section, 'index', index, 'props', props, 'pos=', pos);
  const sp = { props, context, pos, childIndex };
  const optional = ['value', 'width', 'onChange', 'tracking'];
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['target', 'options'], optional, styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;
  //
  const options = getValue(props, 'options', context);
  const value = getWritableValue(props.target, context);
  const onChangeValue = (val) => {
    setValue(props.target, val, context);
    if (props.onChange) {
      triggerAction(props.onChange, context);
    }
    if (typeof context.onTriggerComplete === 'function') { context.onTriggerComplete(); }
  };
  return (
    <Dropdown
      key={index}
      id={props.id}
      name={props.name}
      style={styles}
      className={classes.join(' ')}
      options={options}
      value={value}
      onChange={onChangeValue}
    />
  );
};

export default { InputDropdown };
