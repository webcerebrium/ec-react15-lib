import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* eslint-disable jsx-a11y/label-has-for */
class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.input.checked = this.props.value;
    /*this.addClassName(this.input.checked ? 'fa-check' : '');*/
  }
  addClassName(className) {
    let resultClassName = 'fa ';
    resultClassName = `${resultClassName} ${className}`;
    this.input.className = resultClassName;
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.input.checked = this.props.value;
    }
  }
  onChange(e) {
    this.props.onChange(e.target.checked);
    /*this.addClassName(e.target.checked ? 'fa-check' : '');*/
  }
  render() {
    const styleTop = { ...{ display: 'flex', alignItems: 'flex-start' }, ...this.props.style };
    const styleLabel = { flex: 1 };
    const chkAtLeft = (!this.props.side || this.props.side === 'left');
    const styleCheck = { width: 30, textAlign: chkAtLeft ? 'left' : 'right' };
    return (
      <label className='checkbox' style={styleTop}>
        {!chkAtLeft && this.props.label ? (<div style={styleLabel}>{this.props.label}</div>) : ''}
        <div style={styleCheck}>
          <input
            type='checkbox'
            name={this.props.name}
            ref={(input) => { this.input = input; }}
            onChange={this.onChange}
          />
        </div>
        {chkAtLeft && this.props.label ? (<div style={styleLabel}>{this.props.label}</div>) : ''}
      </label>
    );
  }
}

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default Checkbox;
