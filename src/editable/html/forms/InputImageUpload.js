import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { getStyling } from './../../../services/TplStyling';
import { triggerAction } from './../../../services/DocumentAction';
import { setValue, getWritableValue } from './../../../services/DocumentData';
import { Checkbox } from './../../../components';
import { Logger } from './../../../services/Logger';
/* eslint-disable no-undef */

class InputImageUpload extends Component {
  state = {
    files: [],
    progressBar: true,
    selected: [],
    images: [],
    selectedAll: 'false'
  };
  dropzone = null;

  onDrop = (acceptedFiles) => {
    const errorLoaded = [];
    const images = [];
    const response = [];
    const selected = [];

    const saveResponse = (res) => {
      if (Array.isArray(res)) {
        if (res[0].image && typeof res[0].image === 'object') {
          response.push(res[0].image);
        }
      } else {
        response.push(res);
      }
    };

    const doPromise = (item) => {
      const formData = new FormData();
      formData.append('file', item);
      return triggerAction(this.props.props.onUpload, {
        ...this.props.context,
        data: formData
      });
    };

    const finishAllPromises = () => {
      response.forEach((item) => {
        if (item.original) {
          images.push(item);
        } else {
          errorLoaded.push(Object.keys(item).map((key) => { return `${key}: ${item[key]} `; }));
        }
      });
      images.forEach((file, i) => {
        selected[i] = 'false';
      });
      this.setState({ progressBar: false, files: images, selected });
      setValue(this.props.props.target, images, this.props.context);
      setValue('g:errorMessage', errorLoaded.join('\n'), this.props.context);
    };

    acceptedFiles.reduce((p, item) => {
      return p.then((res) => {
        if (res) saveResponse(res);
        return doPromise(item);
      });
    }, Promise.resolve()).then((res) => {
      if (res) saveResponse(res);
      finishAllPromises();
    });

    this.setState({ progressBar: true, files: acceptedFiles });
  };

  onDelete = () => {
    let files = this.state.files;
    let selected = this.state.selected;
    files = files.filter((file, index) => selected[index] === 'false');
    selected = selected.filter((item, i) => selected[i] === 'false');
    setValue('g:errorMessage', '', this.props.context);
    setValue(this.props.props.target, files, this.props.context);
    this.setState({ files, selected, selectedAll: 'false' });
  };

  isEverySelect = (selected) => {
    if (!selected) return false;
    return selected.every((item) => {
      return item === 'true';
    });
  };

  isSomeSelect = (selected) => {
    if (!selected) return false;
    return selected.some((item) => {
      return item === 'true';
    });
  };

  onSelectAll = (val) => {
    const selected = this.state.selected;
    this.state.files.forEach((item, i) => {
      selected[i] = `${val}`;
    });
    this.setState({ selected, selectedAll: `${val}` });
  };

  onSelect = (isChecked, i) => {
    const selected = this.state.selected;
    selected[i] = `${isChecked}`;
    const selectedAll = this.isEverySelect(selected) ? 'true' : 'false';
    this.setState({ selected, selectedAll });
  };

  componentWillMount() {
    if (this.props.props.target) {
      const currentFiles = getWritableValue(
        this.props.props.target,
        this.props.context,
      );
      if (currentFiles) {
        const selected = [];
        currentFiles.forEach((file, i) => {
          selected[i] = 'false';
        });
        this.setState({ files: currentFiles, selected });
      }
    }
  }

  render() {
    const { section, index, props, context, pos, childIndex } = this.props;
    Logger.of('render.InputFileUpload').info('section', section, 'index', index, 'props', props, 'pos=', pos);
    const sp = { props, context, pos, childIndex };
    const optional = ['value', 'onUpload'];
    const { styles, classes } = getStyling({
      ...sp,
      mandatory: ['target', 'onUpload'],
      optional,
      styling: ['Block', 'Visibility']
    });
    if (!styles) return null;

    const styleText = {
      padding: 20,
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      height: '100%'
    };
    const styleUploadedFiles = {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 10
    };

    const imageBody = (
      this.state.files.map((file, i) => (
        <div style={styleUploadedFiles} key={file.original ? file.original : file.preview}>
          <div style={{ display: 'flex' }}>
            {file.original &&
              <Checkbox
                onChange={val => this.onSelect(val, i)}
                value={
                  this.state.selected.length > 0
                    ? this.state.selected[i]
                    : false
                }
              />}
            <div style={{ marginLeft: '5px' }}>
              <img
                style={{ width: 200, marginBottom: 10, userSelect: 'none' }}
                src={file.original ? file.original : file.preview}
                alt=''
              />
            </div>
          </div>
        </div>))
    );

    const selectedAndDelete = (
      <div style={{ display: 'flex', alignItems: 'center', height: 38 }}>
        {
          this.state.files.length > 1 &&
          <Checkbox
            onChange={this.onSelectAll}
            value={this.state.selectedAll}
          />
        }
        {this.isSomeSelect(this.state.selected) &&
          <button style={{ margin: '0 5px' }} className='btn btn-danger' onClick={this.onDelete} >
            <span>Delete selected</span>
          </button>}
      </div>
    );

    return (
      <div className={classes.join(' ')} style={styles}>
        {
          this.state.files.length > 0 ?
            <div>
              {!this.state.files[0].original ?
                <div className='progress' style={{ width: 200, marginLeft: 5 }}>
                  <div
                    className='progress-bar progress-bar-striped'
                    role='progressbar'
                    style={{ width: '100%' }}
                  >
                    Please, wait while loading...
                  </div>
                </div>
              : selectedAndDelete}
              {imageBody}
            </div>
          :
            <Dropzone
              multiple={true}
              accept='image/jpeg, image/png'
              ref={(node) => { this.dropzone = node; }}
              onDrop={this.onDrop}
            >
              <div style={styleText}>
                Try dropping a file here to replace product image
              </div>
            </Dropzone>
        }
      </div>
    );
  }
}

export default { InputImageUpload };
