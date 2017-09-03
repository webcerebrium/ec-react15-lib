import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { getStyling } from './../../../services/TplStyling';
import { Logger } from './../../../services/Logger';

class InputFileUpload extends Component {
  state = { files: [] };
  dropzone = null;

  onDrop = (acceptedFiles) => {
    this.setState({ files: acceptedFiles });
    // this.props.onUpload(acceptedFiles[0]).then(() => {
      // this.setState({ files: [] });
    // });
  }
  onOpenClick = () => {
    this.dropzone.open();
  }

  render() {
    const { section, index, props, context, pos, childIndex } = this.props;
    Logger.of('render.InputFileUpload').info('section', section, 'index', index, 'props', props, 'pos=', pos);
    const sp = { props, context, pos, childIndex };
    const optional = ['value', 'onUpload', 'tracking'];
    const { styles, classes } = getStyling({
      ...sp, mandatory: ['target', 'options'], optional, styling: ['Block', 'Visibility']
    });
    if (styles === false) return false;

    const styleText = { padding: 20, fontSize: 12 };
    const styleBtn = { width: 200 };
    const styleInProgress = { textAlign: 'center', fontSize: 12 };
    return (
      <div className={classes.join(' ')} style={styles}>
        <Dropzone multiple={true} accept='image/*' ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
          <div style={styleText}>Try dropping a file here to replace product image</div>
        </Dropzone>
        <button type='button' className='btn btn-sm' onClick={this.onOpenClick} style={styleBtn}>
          Browse Local Files
        </button>
        {this.state.files.length > 0 ? (
          <div>
            <div style={styleInProgress}>Uploading in progress...</div>
            <div>
              {this.state.files.map(file => (
                <div key={file.preview}>
                  <img style={{ width: 200, marginBottom: 10 }} alt='' src={file.preview} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default { InputFileUpload };
