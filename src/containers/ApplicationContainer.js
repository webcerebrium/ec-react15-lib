import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Logger } from './../services/Logger';
import { getDocumentContext } from './../services/TplContext';
import { renderDocument } from './../services/TplRenderer';

class ApplicationContainer extends Component {
  componentWillMount() {
    Logger.of('ApplicationContainer').info('template=', this.props.globals.template);
  }
  render() {
    const g = this.props.globals;
    const q = this.props.queries;
    if (!g || !g.template || !q) return false;
    const tplContents = q.d[g.template];
    const layoutContents = g.layout ? q.d[g.layout] : undefined;
    return (
      <div id='DocumentRoot'>
        {renderDocument(tplContents, layoutContents, getDocumentContext(this.props))}
      </div>
    );
  }
}

const mapStateToProps = state => (state);

const mapDispatchToProps = (dispatch) => {
  return {
    onSet: (key, value) => {
      dispatch({ type: 'SET_DATA', payload: [key, value] });
    },
    onTriggerComplete: () => {
      Logger.of('ApplicationContainer.onTriggerComplete').info('UPDATE_DATA');
      dispatch({ type: 'UPDATE_DATA' });
    },
    onNavigate: (url) => {
      dispatch(push(url));
    },
    onDispatch: (type, payload) => {
      dispatch({ type, payload });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);
