import React from 'react';

const Checkbox = (props) => {
  const isChecked = props.value === 'true';
  const onChange = () => {
    props.onChange(!isChecked);
  };
  const chkAtLeft = (!props.side || props.side === 'left');
  const styles = {
    forTop: { display: 'flex', alignItems: 'flex-start', cursor: 'pointer' },
    forLabel: { flex: 1, marginLeft: '15px', color: '#000' },
    forCheck: { textAlign: chkAtLeft ? 'left' : 'right', margin: '0px auto', marginTop: '7px' },
    forButton: { stroke: '#666', strokeWidth: 1, strokeOpacity: '0.5' }
  };
  return (
    <div className='checkboxButton' style={styles.forTop}>
      {!chkAtLeft && props.label ? (<div style={styles.forLabel}>{props.label}</div>) : ''}
      <div
        role='checkbox'
        aria-checked='false'
        tabIndex={0}
        style={styles.forCheck}
        onMouseDown={onChange}
      >
        <svg width='20' height='20'>
          <rect x='0' y='0' width='20' height='20' fill='transparent' style={styles.forButton} />
          {isChecked && (<polygon fill='#666' points='7.6,11.6 4.4,8.4 2,10.8 7.6,16.4 18,6 15.6,3.6'></polygon>)}
        </svg>
      </div>
      {chkAtLeft && props.label ? (
        <div
          role='checkbox'
          aria-checked='false'
          tabIndex={0}
          onMouseDown={onChange}
          style={styles.forLabel}
        >
          {props.label}
        </div>
      ) : ''
      }
    </div>
  );
};

export default Checkbox;
