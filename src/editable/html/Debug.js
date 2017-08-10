import React from 'react';
import { Logger, getEvaluated, getStyling } from './../../services';

export const Debug = ({ section, index, props, context, pos, childIndex }) => {
  if (!props) return false;
  const tplProps = getEvaluated(props, context);
  const sp = { props, context, pos, childIndex };
  const { styles, classes } = getStyling({ ...sp, optional: ['*'], styling: ['Block', 'Visibility'] });
  if (styles === false) return false;
  //
  if (typeof jest === 'undefined' && props.console) {
    Logger.of('render.Debug').warn('section=', section, 'index=', index, 'props=', props, 'context=', context);
  }
  return (
    <div style={styles} className={classes.join(' ')} key={index} rel={tplProps.rowset}>
      <pre style={{ textAlign: 'left' }}>{JSON.stringify(tplProps, null, 2)}</pre>
    </div>
  );
};

export default {
  Debug
};
