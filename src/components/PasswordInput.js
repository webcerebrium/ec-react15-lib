import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.isFocused = false;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }
  componentDidMount() {
    this.input.value = typeof this.props.value === 'undefined' ? '' : this.props.value;
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      if (!this.isFocused) {
        this.input.value = typeof this.props.value === 'undefined' ? '' : this.props.value;
      }
    }
  }
  handleKeyPress(e) {
    if (e.which === 13 && typeof this.props.onEnter === 'function') {
      this.props.onEnter();
    }
    if (e.which === 27 && typeof this.props.onEsc === 'function') {
      this.props.onEsc();
    }
  }
  render() {
    const onChange = e => (this.props.onChange(e.target.value));
    const safeValue = typeof this.props.value !== 'undefined' ? this.props.value : '';
    return (
      <input
        id={this.props.id}
        spellCheck={false}
        maxLength={this.props.maxLength}
        ref={(input) => { this.input = input; }}
        onChange={onChange}
        onKeyPress={this.handleKeyPress}
        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        className={`form-control ${this.props.className ? this.props.className : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={this.props.style}
        name={this.props.name}
        defaultValue={safeValue}
        type='password'
      />
    );
  }
}

PasswordInput.propTypes = {
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired
};

export default PasswordInput;
