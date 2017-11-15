import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Debounced from './../services/Debounced';

class Dropdown extends Component {
  input = null;
  componentDidMount() {
    //Debounced.start(`update-of-${this.props.id}`, () => (this.input.value = this.props.value), 300);
    //this.input.value = this.props.value;
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      Debounced.start(`update-of-${this.props.id}`, () => { this.input.value = this.props.value; }, 300);
    }
  }
  render() {
    if (!this.props.options) return false;
    const onChange = e => (this.props.onChange(e.target.value));
    return (
      <select
        id={this.props.id}
        name={this.props.name}
        ref={(input) => { this.input = input; }}
        value={this.props.value}
        onChange={onChange}
        className={`form-control ${this.props.className}`}
        style={this.props.style}
      >
        {this.props.options.map((item, index) => {
          const kIndex = index;
          return <option key={kIndex} value={item.value}>{item.label}</option>;
        })}
      </select>
    );
  }
}

Dropdown.propTypes = {
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // options: PropTypes.array.isRequired, // options should have value and label fields
  onChange: PropTypes.func.isRequired
};

export default Dropdown;
