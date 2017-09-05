import React, { Component } from 'react';
import tinycolor from 'tinycolor2';
import styled from 'styled-components';
import './colorpicker.css';
import Debounced from '../../services/Debounced';
import { Colors as colors } from './colors.config';
import TextInput from '../TextInput';
import ColorSlider from './ColorSlider';
import Color2dPicker from './Color2dPicker';
import ModalPanel from '../ModalPanel';

const Button = styled.button` 
  &:focus, &:active, &:focus:active, &.active:focus {
    outline: none;
  }
`;


const ColorsPanel = ({ value, onSelectColor }) => {
  const currentColor = tinycolor(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden', position: 'relative' }} >
      {colors.map((color, itemIndex) => {
        const colorName = color.name;
        const colorHex = (color.hex).toLowerCase();
        const colorIndex = itemIndex;
        const handleColorSelect = (e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectColor(color.rgb);
        };
        const divStyle = { width: '15px', height: '15px', margin: '1px' };
        const linkStyle = { position: 'absolute', width: '100%', height: '100%' };
        const activeColor = colorHex === currentColor.toHex() ? { border: '2px solid #ccc' }
          : { border: '1px solid #ccc' };
        return (
          <div key={colorIndex} style={{ ...divStyle, ...activeColor, backgroundColor: `#${colorHex}` }}>
            <a alt={colorName} href='/' onClick={handleColorSelect} style={linkStyle} >&nbsp;</a>
          </div>
        );
      })}
    </div>
  );
};

const RGBColorControl = ({ value, onSelectColor }) => {
  const currentColorRGB = value;
  const r = currentColorRGB.r;
  const g = currentColorRGB.g;
  const b = currentColorRGB.b;
  const handleChangeColor = (red, green, blue) => (onSelectColor({ r: red, g: green, b: blue }));
  const labelStyle = { float: 'left', width: '20%', paddingTop: '7px', display: 'inline-block' };
  const sliderStyle = { float: 'right', width: '80%' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <div style={labelStyle}>R {r}</div>
        <ColorSlider
          value={r}
          style={sliderStyle}
          startColor={{ r: 0, g, b }}
          endColor={{ r: 255, g, b }}
          onChange={val => (handleChangeColor(val, g, b))}
          min={0}
          max={255}
          width={288}
        />
      </div>
      <div>
        <div style={labelStyle}>G {g}</div>
        <ColorSlider
          value={g}
          style={sliderStyle}
          startColor={{ r, g: 0, b }}
          endColor={{ r, g: 255, b }}
          onChange={val => (handleChangeColor(r, val, b))}
          min={0}
          max={255}
          width={288}
        />
      </div>
      <div>
        <div style={labelStyle}>B {b}</div>
        <ColorSlider
          value={b}
          style={sliderStyle}
          startColor={{ r, g, b: 0 }}
          endColor={{ r, g, b: 255 }}
          onChange={val => (handleChangeColor(r, g, val))}
          min={0}
          max={255}
          width={288}
        />
      </div>
    </div>
  );
};

class ColorPicker extends Component {
  state = {
    hsvColor: tinycolor(this.props.value).toHsv(),
    huge: null,
    lastColors: [tinycolor(this.props.value).toHsv()],
    isOpen: false
  };

  handleColorSelect = (selectedColor) => {
    const newColor = tinycolor(selectedColor);
    const hsvColor = newColor.toHsv();
    this.setState({ hsvColor });
    Debounced.start('ColorPicker.Color onChange', () => {
      this.props.onChange(newColor.toHexString());
    }, 50);
  };

  handleHugeChange = (value) => {
    const hsvColor = { ...this.state.hsvColor, h: value };
    this.setState({ ...this.state, hsvColor, huge: hsvColor });
    Debounced.start('ColorPicker.handleHugeChange', () => {
      const newColor = tinycolor(hsvColor);
      this.props.onChange(newColor.toHexString());
    }, 50);
  };

  render() {
    const value = this.state.hsvColor;
    const huge = this.state.hsvColor.h;
    const Color = tinycolor(value);
    const colorRgb = Color.toRgb();
    const getLastColors = () => {
      const colorsList = this.state.lastColors;
      return colorsList.map((color, index) => {
        const key = index;
        const styleObj = {
          margin: '0 5px 10px 0',
          width: '30px',
          height: '30px',
          background: tinycolor(color).toHexString()
        };
        const handleOnClick = () => (this.handleColorSelect(color));
        return (
          <div key={key} style={styleObj} role='button' tabIndex='0' onClick={handleOnClick} >&nbsp;</div>
        );
      });
    };
    const coords = this.buttonAction ? this.buttonAction.getBoundingClientRect() : false;
    const topContainerInner = coords ? `${coords.bottom}px` : '';
    const containerInnerStyle = {
      width: 400,
      overflow: 'hidden',
      position: 'relative',
      top: topContainerInner
    };

    const containerOuterStyle = {
      justifyContent: 'flex-end'
    };

    const containerModalStyle = {
      backgroundColor: 'transparent'
    };

    const currentObj = {
      margin: '0 5px 10px 0',
      width: '30px',
      height: '30px',
      background: Color.toHexString()
    };

    const lastColors = this.state.lastColors;
    return (
      <div>
        <Button
          className='btn btn-default'
          innerRef={(buttonReason) => { this.buttonAction = buttonReason; }}
          onClick={() =>
            this.setState({ isOpen: !this.state.isOpen })}
        >
          <i className='fa fa-paint-brush' />
        </Button>
        {
          this.state.isOpen &&
          <ModalPanel
            innerStyle={containerInnerStyle}
            outerStyle={containerOuterStyle}
            modalStyle={containerModalStyle}
            onClick={() =>
              this.setState({
                isOpen: false,
                lastColors: lastColors.concat(Color)
              })
            }
          >
            <div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{getLastColors()}</div>
                <div style={{ display: 'flex' }}>
                  <div style={currentObj}></div>
                  <TextInput
                    value={Color.toHexString()}
                    style={{ width: '150px', height: '30px' }}
                    onChange={this.handleColorSelect}
                  />
                </div>
              </div>
              <RGBColorControl value={colorRgb} onSelectColor={this.handleColorSelect} />
              <ColorSlider
                className='slider-huge'
                style={{ height: '10px' }}
                onChange={this.handleHugeChange}
                value={huge}
                min={0}
                max={359}
                width={360}
              />
              <Color2dPicker
                background={this.state.huge}
                value={this.state.hsvColor}
                onSelectColor={this.handleColorSelect}
              />
            </div>
            <div>
              <ColorsPanel value={colorRgb} onSelectColor={this.handleColorSelect} />
            </div>
          </ModalPanel>
        }
      </div>
    );
  }
}

export default ColorPicker;
