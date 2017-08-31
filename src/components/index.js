import React from 'react';
import Dropdown from './Dropdown';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import TextArea from './TextArea';
import Checkbox from './Checkbox';
import ModalWindow from './ModalWindow';
import ModalPanel from './ModalPanel';
import ColorPicker from './colorpicker/ColorPicker';

const styleInfoBox = {
  margin: '0px auto',
  marginBottom: 20,
  padding: 15,
  color: '#888',
  fontSize: 14,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderWidth: 1,
  minWidth: 640,
  background: '#ffe',
  boxShadow: '3px 3px 10px #bbb'
};
export const InfoBox = props => (<div style={styleInfoBox}>{props.children}</div>);

const stylePropertiesBox = {
  margin: '0px auto', marginBottom: 20, width: 640, background: 'white', boxShadow: '3px 3px 10px #bbb'
};
const stylePropertiesBoxTitle = {
  textAlign: 'center', color: '#aaa', fontWeight: 'bold', paddingTop: 5, paddingBottom: 5
};
export const PropertiesBox = props => (
  <div style={stylePropertiesBox}>
    {(props.title ? (<div style={stylePropertiesBoxTitle}>{props.title}</div>) : false)}
    <div className='form-horizontal'>
      {props.children}
    </div>
  </div>
);

const stylePropertyBox = { borderTop: '1px #eee solid', marginBottom: 0, padding: '5px 0px' };
const stylePropertyBoxLabel = { fontSize: 14, lineHeight: '35px', marginBottom: 0, textAlign: 'right' };
const stylePropertyBoxValue = { lineHeight: '35px', marginBottom: 0, fontWeight: 'bold' };

export const PropertyBox = props => (
  <div className='form-group clearfix' style={stylePropertyBox}>
    <div className='col-sm-4 label' style={stylePropertyBoxLabel}>{props.label}</div>
    <div className='col-sm-8'>
      {props.value ? (<div style={stylePropertyBoxValue}>{props.value}</div>) : false}
      {props.children}
    </div>
  </div>
);

export const FormGroup = props => (<div className={props.className} style={props.style}>{props.children}</div>);
export const FormRow = props => (
  <div className={`${props.className ? props.className : ''}`} style={props.style}>{props.children}</div>
);
export const FormLabel = ({ children }) => (
  <div className='form-label'>{children}</div>
);

const styleToolHeaderFont = { fontWeight: 'bold', color: '#6b9ed3' };
const styleToolHeaderBox = { position: 'relative', paddingTop: 10, marginBottom: 5 };
const styleToolHeader = { ...styleToolHeaderFont, ...styleToolHeaderBox, borderBottom: '2px #6b9ed3 solid' };
export const ToolHeader = ({ children }) => (<div style={styleToolHeader}>{children}</div>);

export {
  Dropdown,
  Checkbox,
  TextArea,
  TextInput,
  PasswordInput,
  ModalWindow,
  ModalPanel,
  ColorPicker
};
