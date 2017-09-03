import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { getStyling } from './../../../services/TplStyling';
import { triggerAction } from './../../../services/DocumentAction';
import { setValue, getWritableValue } from './../../../services/DocumentData';
import { Checkbox } from './../../../components';
import { Logger } from './../../../services/Logger';
import { Loader } from './Loader';
/* eslint-disable no-undef */

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => {
      return hasCanceled_ ? reject({ isCanceled: true }) : resolve(val);
    });
    promise.catch((error) => {
      return hasCanceled_ ? reject({ isCanceled: true }) : reject(error);
    });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

class InputImageUpload extends Component {
  state = {
    isReady: false,
    files: [],
    images: [],
    selectedAll: 'false'
  };
  dropzone = null;

  status = [
    'Pending...',
    'Uploading..',
    'Success',
    'Error'
  ];

  onDrop = (acceptedFiles) => {
    const images = [];
    const files = [];
    const prevFiles = this.state.files;
    let doPromise = () => {};
    let finishAllPromises;

    acceptedFiles.forEach((file, i) => {
      files[i] = { ...file, status: this.status[0], error: '', original: '', selected: 'false' };
    });

    const saveResponse = (res) => {
      let value = {};
      if (Array.isArray(res)) {
        if (res[0].image && typeof res[0].image === 'object') {
          images.push(res[0].image);
          value = { ...res[0].image, status: this.status[2] };
        }
      } else {
        value = { error: JSON.stringify(res), status: this.status[3] };
      }
      return value;
    };

    const cancelablePromise = makeCancelable(
      acceptedFiles.reduce((p, item, index) => {
        return p.then((res) => {
          let prevRes = {};
          if (res) {
            prevRes = saveResponse(res);
          }
          return doPromise(item, index, prevRes);
        });
      }, Promise.resolve())
        .then((res, index) => {
          let prevRes = {};
          if (res) {
            prevRes = saveResponse(res, index);
          }
          finishAllPromises(prevRes);
        })
    );

    doPromise = (item, index, prevRes) => {
      const formData = new FormData();
      formData.append('file', item);
      files[index].status = this.status[1];
      if (prevRes !== {} && index > 0) {
        files[index - 1] = { ...files[index - 1], ...prevRes };
      }
      if (!this.dropzone) {
        cancelablePromise.cancel();
      } else {
        this.setState({ files: prevFiles.concat(files) });
        return triggerAction(this.props.props.onUpload, {
          ...this.props.context,
          data: formData
        });
      }
      return null;
    };

    finishAllPromises = (prevRes) => {
      const lastIndex = files.length - 1;
      if (prevRes !== {}) {
        files[lastIndex] = { ...files[lastIndex], ...prevRes };
      }
      const newImages = this.state.images.concat(images);
      setValue(this.props.props.target, newImages, this.props.context);
      if (!this.dropzone) {
        cancelablePromise.cancel();
      } else {
        this.setState({
          files: prevFiles.concat(files),
          isReady: true,
          images: newImages
        });
      }
    };

    cancelablePromise
      .promise
      .catch((reason) => {
        setValue('g:errorMessage', 'Component has unmounted.', this.props.context);
        return Logger.of('render.InputImageUpload').info('Component has unmounted.', 'Promise:', reason);
      });

    this.setState({
      files: prevFiles.concat(files),
      isReady: false
    });
    setValue('g:errorMessage', '', this.props.context);
  };

  onDelete = () => {
    let files = this.state.files;
    let images = this.state.images;
    files = files.filter((file) => { return file.selected === 'false'; });
    const existImage = files
      .filter((file) => { return file.original; })
      .map((file) => { return file.original; });
    images = images.filter((image) => { return existImage.some((img) => { return img === image.original; }); });
    setValue(this.props.props.target, images, this.props.context);
    setValue('g:errorMessage', '', this.props.context);
    const isReady = files.length > 0;
    this.setState({
      files,
      images,
      isReady,
      selectedAll: 'false'
    });
  };

  isEverySelect = (selected) => {
    if (!selected) return false;
    return selected.every((item) => {
      return item.selected === 'true';
    });
  };

  isSomeSelect = (selected) => {
    if (!selected) return false;
    return selected.some((item) => {
      return item.selected === 'true';
    });
  };

  onSelectAll = (val) => {
    const files = this.state.files;
    files.forEach((item, i) => {
      files[i].selected = `${val}`;
    });
    this.setState({ files, selectedAll: `${val}` });
  };

  onSelect = (isChecked, i) => {
    const files = this.state.files;
    files[i].selected = `${isChecked}`;
    const selectedAll = this.isEverySelect(files) ? 'true' : 'false';
    this.setState({ files, selectedAll });
  };

  componentWillMount() {
    if (this.props.props.target) {
      const files = getWritableValue(
        this.props.props.target,
        this.props.context,
      );
      if (files) {
        files.forEach((file, i) => {
          files[i] = { ...files[i], selected: 'false' };
        });
        this.setState({ files, images: files, isReady: true });
      }
    }
  }

  render() {
    const { section, index, props, context, pos, childIndex } = this.props;
    Logger.of('render.InputImageUpload').info('section', section, 'index', index, 'props', props, 'pos=', pos);
    const sp = { props, context, pos, childIndex };
    const optional = ['tracking'];
    const { styles, classes } = getStyling({
      ...sp,
      mandatory: ['target', 'onUpload'],
      optional,
      styling: ['Block', 'Visibility']
    });

    if (!styles) return null;

    const styleText = {
      padding: 20,
      fontSize: 20,
      fontWeight: 600,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%'
    };

    const styleUploadedFiles = {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
      width: 230
    };

    const styleUploading = {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 10,
      width: 230
    };

    const globalStatus = getWritableValue('g:loadingStatus', this.props.context);

    return (
      <div className={classes.join(' ')} style={styles}>
        {
          this.state.isReady &&
          <div style={{ display: 'flex', justifyContent: 'space-between', height: 38, margin: '10px 0' }}>
            {
              this.state.files.length > 1 &&
              <Checkbox
                onChange={this.onSelectAll}
                label='Select all'
                value={this.state.selectedAll}
              />
            }
            {this.isSomeSelect(this.state.files) &&
            <button style={{ margin: '0 5px' }} className='btn btn-danger' onClick={this.onDelete} >
              <span>Delete selected</span>
            </button>}
          </div>
        }
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          {
            this.state.files.length > 0 &&
            this.state.files.map((file, i) => (
              <div style={styleUploadedFiles} key={file.original ? file.original : file.preview}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {
                    this.state.isReady ?
                      <div style={{ height: '100%' }}>
                        <Checkbox
                          disabled='true'
                          onChange={val => this.onSelect(val, i)}
                          value={file.selected}
                        />
                      </div> : null
                  }
                  {
                    (file.status === this.status[0] || file.status === this.status[1]) ?
                      <div className='progress' style={{ marginLeft: 5, position: 'absolute', zIndex: 1 }}>
                        <div
                          className='progress-bar progress-bar-striped'
                          role='progressbar'
                          style={{ width: '100px' }}
                        >
                          { file.status }
                        </div>
                      </div> : null
                  }
                  {
                    file.status !== this.status[3] ?
                      <div style={{ marginLeft: '5px' }}>
                        <img
                          style={{
                            width: 200,
                            marginBottom: 10,
                            userSelect: 'none',
                            opacity: (file.status === this.status[0] || file.status === this.status[1]) ? 0.4 : 1
                          }}
                          src={file.preview ? file.preview : file.original}
                          alt=''
                        />
                      </div>
                      :
                      <div style={{ marginLeft: '5px', width: 200, wordWrap: 'break-word' }}>
                        <div className='alert alert-warning'>
                          { file.error }
                        </div>
                      </div>
                  }
                </div>
              </div>))
          }
          <div style={styleUploading}>
            {
              globalStatus !== 'in_progress' ?
                <Dropzone
                  multiple={true}
                  accept='image/jpeg, image/png'
                  ref={(node) => { this.dropzone = node; }}
                  onDrop={this.onDrop}
                  style={{ width: 200, borderWidth: 2, border: '1px dashed rgb(102, 102, 102)', borderRadius: 5 }}
                >
                  <div style={styleText}>
                    <div><span>+</span>Add Image</div>
                    <div style={{ color: '#c7c7c7', textTransform: 'uppercase', fontSize: '12px' }}>
                      Drop image here to upload
                    </div>
                  </div>
                </Dropzone>
                : <div style={styleText}>
                  <Loader
                    section={section}
                    index={index}
                    props={{ _id: 'loaderInputImageUpload' }}
                    context={context}
                    pos={pos}
                    childIndex={childIndex}
                  />
                  <div>Uploading...</div>
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default { InputImageUpload };
