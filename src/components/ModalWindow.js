import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Backdrop = styled.button`
  float: right;
  background: none;
  border: none;
  margin-top: 1em;
  margin-right: 1em;
  font-size: 1.2em;
`;

const ContainerOuterStyle = styled.div`
  overflow-y: scroll;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const ContainerInnerStyle = styled.div`
  background-color: #fff;
  padding: 0;
  margin: 15px;
  box-shadow: 0px 0px 10px #999;
  max-width: 790px;
  border-radius: 5px;
  z-index: 1;
  width: 100%;
`;

const Arr = styled.div`
  padding: 20px;
`;

const Modal = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 0;
  background-color: #000;
  opacity: 0.8;
  @media(min-width: 700px) {
    right: 17px;
  }
`;

class ModalWindow extends Component {
  modalTarget = null;
  componentDidMount() {
    /* eslint-disable no-undef */
    this.modalTarget = document.createElement('div');
    this.modalTarget.setAttribute(
      'style', 'position: fixed; height: 100%; left: 0; top: 0; width: 100%; z-index: 9999;'
    );
    document.body.appendChild(this.modalTarget);
    document.documentElement.style.overflow = 'hidden';
    this._render();
    /* eslint-enable no-undef */
  }
  componentDidUpdate() {
    this._render();
  }
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.modalTarget);
    /* eslint-disable no-undef */
    document.body.removeChild(this.modalTarget);
    document.documentElement.style.overflow = 'auto';
    /* eslint-enable no-undef */
  }
  _render() {
    ReactDOM.render((
      <ContainerOuterStyle className={this.props.containerOuterClassName} >
        <ContainerInnerStyle className={this.props.containerInnerClassName} >
          <Backdrop className='backdrop' onClick={this.props.onClick} >X</Backdrop>
          <Arr className={this.props.className} >{this.props.children}</Arr>
        </ContainerInnerStyle>
        <Modal onMouseDown={this.props.onClick} className={this.props.modalClassName} />
      </ContainerOuterStyle>
    ), this.modalTarget);
  }
  render() {
    return <noscript />;
  }
}

export default ModalWindow;
