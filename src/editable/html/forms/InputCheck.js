import React from 'react';
import { Checkbox } from './../../../components';
import { triggerAction } from './../../../services/DocumentAction';
import { Logger, setValue, getValue, getWritableValue, getStyling } from './../../../services';

export const InputCheck = ({ section, index, props, context, pos, childIndex }) => {
  Logger.of('render.InputCheck').info('section', section, 'index', index, 'pos', pos);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({
    ...sp, mandatory: ['target'], optional: ['value', 'onChange', 'tracking'], styling: ['Block', 'Text', 'Visibility']
  });
  if (styles === false) return false;

  const value = getWritableValue(props.target, context);
  const onChangeValue = (val) => {
    setValue(props.target, val, context);
    if (props.onChange) {
      triggerAction(props.onChange, context);
    }
    if (typeof context.onTriggerComplete === 'function') { context.onTriggerComplete(); }
  };
  return (
    <div key={index} style={styles} className={classes.join(' ')} >
      <Checkbox label={getValue(props, 'value', context)} value={value} onChange={onChangeValue} />
    </div>
  );
};

export default { InputCheck };
