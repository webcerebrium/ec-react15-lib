import React, { Component } from 'react';
import PropTypes from 'prop-types';

const isValidValue = val => (typeof val !== 'undefined');

class TextArea extends Component {
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
    this.textarea.value = !isValidValue(this.props.value) ? '' : this.props.value;
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      if (!this.isFocused) {
        this.textarea.value = !isValidValue(this.props.value) ? '' : this.props.value;
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
      <textarea
        id={this.props.id}
        name={this.props.name}
        rows={this.props.rows}
        maxLength={this.props.maxLength}
        ref={(textarea) => { this.textarea = textarea; }}
        onChange={onChange}
        onKeyPress={this.handleKeyPress}
        placeholder={this.props.placeholder}
        className={`form-control ${this.props.className ? this.props.className : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={this.props.style}
        defaultValue={safeValue}
      />
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TextArea;
