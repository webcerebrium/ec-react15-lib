import React, { Component } from 'react';
import './colorpicker.css';

/* eslint-disable no-undef */

class ColorSlider extends Component {
  state = {
    isDragging: false,
    posX: 0
  };
  maxValue = null;

  componentWillMount() {
    if (!this.props.value) {
      this.props.onChange(this.props.min);
    } else {
      this.props.onChange(this.props.value);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDragging && !prevState.isDragging) {
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseup', this.onStop);
    } else if (!this.state.isDragging && prevState.isDragging) {
      document.removeEventListener('mousemove', this.onMove);
      document.removeEventListener('mouseup', this.onStop);
    }
    if (this.touchControl) {
      this.maxValue = Math.floor(this.touchControl.offsetParent.getBoundingClientRect().width - 8);
    }
  }
  getRelPosX = () => {
    const minValue = this.props.min;
    const maxValue = this.props.max;
    const width = this.props.width ? this.props.width : this.props.max;
    const value = this.props.value ? this.props.value : minValue;
    const pos = (value - minValue) / ((maxValue - minValue) / 100);

    return (pos * (width - 8)) / 100.0;
  };

  onStart = (e) => {
    //if (e.button !== 0 || e.touches.length !== 1) return;
    const sliderPos = this.touchControl.getBoundingClientRect();
    this.setState({
      isDragging: true,
      posX: sliderPos.left - this.getRelPosX()
    });
    e.stopPropagation();
    e.preventDefault();
  };

  onMove = (e) => {
    const maxPosX = this.touchControl.offsetParent.getBoundingClientRect().width - 10;
    const val = Math.max((e.pageX - 15) - this.state.posX, 0);
    const relPosX = Math.min(val, maxPosX);
    this.calculate(relPosX);
  };

  onStop = (e) => {
    if (!this.state || !this.state.isDragging) return;
    this.setState({ isDragging: false });
    e.stopPropagation();
    e.preventDefault();
  };

  calculate = (relPosX) => {
    const currentValue = Math.ceil((Math.floor(relPosX) * 100) / this.maxValue);
    const rangeValue = this.calculateRangeValue(currentValue);
    this.props.onChange(rangeValue);
  };

  handleMouseDown = (e) => {
    this.onStart(e);
  };

  calculateRangeValue = (value) => {
    const minValue = this.props.min;
    const maxValue = this.props.max;
    const koef = (maxValue - minValue) / 100;
    return minValue + Math.round(value * koef);
  };

  getBackgroundSlider = () => {
    if (this.props.startColor && this.props.endColor) {
      const startColor = this.props.startColor && this.props.startColor;
      const endColor = this.props.endColor && this.props.endColor;
      const startColorStr = `rgb(${startColor.r},${startColor.g},${startColor.b})`;
      const endColorStr = `rgb(${endColor.r},${endColor.g},${endColor.b})`;
      return { background: `-webkit-gradient(linear, 0% 0%, 100% 0%, from(${startColorStr}), to(${endColorStr}))` };
    }
    return { background: '' };
  };

  render() {
    return (
      <div
        className={`block-slider ${this.props.className && this.props.className}`}
        style={this.props.style && this.props.style}
      >
        <div className='block-slider__cont' >
          <div
            className='block-slider__touch'
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleMouseDown}
            onTouchMove={this.onMove}
            ref={(touchControl) => { this.touchControl = touchControl; }}
            style={{ left: this.getRelPosX() }}
            role='button'
            tabIndex='0'
          >
          </div>
          <div className='block-slider__line' style={this.getBackgroundSlider()} >
            <span>&nbsp;</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ColorSlider;
