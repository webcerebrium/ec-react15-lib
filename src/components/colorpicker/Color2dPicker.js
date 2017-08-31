import React, { Component } from 'react';
import tinycolor from 'tinycolor2';
import './colorpicker.css';

/* eslint-disable no-undef */

class Color2dPicker extends Component {
  state = {
    isDragging: false,
    pos: { x: 0, y: 0 }
  };

  maxWidth = null;
  maxHeight = null;

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDragging && !prevState.isDragging) {
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseup', this.onStop);
    } else if (!this.state.isDragging && prevState.isDragging) {
      document.removeEventListener('mousemove', this.onMove);
      document.removeEventListener('mouseup', this.onStop);
    }
    if (this.touchControl) {
      this.maxWidth = Math.floor(this.touchControl.offsetParent.getBoundingClientRect().width - 10);
      this.maxHeight = Math.floor(this.touchControl.offsetParent.getBoundingClientRect().height - 10);
    }
  }

  getRelPosX = () => {
    const currentColor = this.props.value;
    return (currentColor.s) * (360 - 10);
  };

  getRelPosY = () => {
    const currentColor = this.props.value;
    return (1 - currentColor.v) * (200 - 10);
  };

  onStart = (e) => {
    //if (e.button !== 0 || e.touches.length !== 1) return;
    const sliderPos = this.touchControl.getBoundingClientRect();
    this.setState({
      isDragging: true,
      pos: {
        x: sliderPos.left - this.getRelPosX(),
        y: sliderPos.top - this.getRelPosY()
      }
    });
    e.stopPropagation();
    e.preventDefault();
  };

  onMove = (e) => {
    const maxPosX = this.touchControl.offsetParent.getBoundingClientRect().width - 10;
    const maxPosY = this.touchControl.offsetParent.getBoundingClientRect().height - 10;
    const valX = Math.max((e.pageX - 15) - this.state.pos.x, 0);
    const valY = Math.max((e.pageY - 15) - this.state.pos.y, 0);
    const relPosX = Math.min(valX, maxPosX);
    const relPosY = Math.min(valY, maxPosY);
    this.calculate(relPosX, relPosY);
  };

  onStop = (e) => {
    if (!this.state || !this.state.isDragging) return;
    this.setState({ isDragging: false });
    e.stopPropagation();
    e.preventDefault();
  };

  calculate = (relPosX, relPosY) => {
    const s = Math.ceil((Math.floor(relPosX) * 100) / this.maxWidth);
    const v = 100 - (Math.ceil((Math.floor(relPosY) * 100) / this.maxHeight));
    const currentColor = this.props.value;
    this.props.onSelectColor({ ...currentColor, s, v });
  };

  handleMouseDown = (e) => {
    this.onStart(e);
  };

  render() {
    const backgroundColor = tinycolor(this.props.background);
    const backgroundColorStyle = { backgroundColor: backgroundColor.toRgbString() };
    return (
      <div
        className={`block-color2dPicker ${this.props.className && this.props.className}`}
        style={{ width: '100%', height: '200px', marginTop: '10px', marginBottom: '10px' }}
      >
        <div
          className='pickingArea'
          onMouseDown={this.handleMouseDown}
          style={backgroundColorStyle}
          role='button'
          tabIndex='0'
        >
          <div
            className='picker'
            style={{ left: this.getRelPosX(), top: this.getRelPosY() }}
            ref={(touchControl) => {
              this.touchControl = touchControl;
            }}
          >
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
}


export default Color2dPicker;
