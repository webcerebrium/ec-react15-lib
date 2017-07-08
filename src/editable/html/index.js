import * as _container from './containers/Container';
import * as _divider from './containers/Divider';
import * as _widget from './containers/Widget';
import * as _iframe from './media/Iframe';
import * as _stripelayout from './containers/StripeLayout';
import * as _gridlayout from './containers/GridLayout';
// import * as _freelayout from './containers/FreeLayout';
import * as _flexlayout from './containers/FlexLayout';
import * as _fixedlayout from './containers/FixedLayout';
import * as _featurelayout from './containers/FeatureLayout';
import * as _text from './text/Text';
import * as _paragraph from './text/Paragraph';
import * as _header from './text/Header';
import * as _list from './text/List';
import * as _debug from './Debug';
import * as _image from './media/Image';
import * as _link from './media/Link';
import * as _loader from './forms/Loader';
import * as _button from './forms/Button';
import * as _messages from './forms/ErrorMessageBox';
import * as _inputtext from './forms/InputText';
import * as _inputpassword from './forms/InputPassword';
import * as _inputcheck from './forms/InputCheck';
import * as _inputdropdown from './forms/InputDropdown';
import * as _inputfile from './forms/InputFileUpload';

export default {
  ..._container.default,
  ..._divider.default,
  ..._widget.default,
  ..._iframe.default,
  ..._stripelayout.default,
  ..._gridlayout.default,
  // ..._freelayout.default,
  ..._flexlayout.default,
  ..._fixedlayout.default,
  ..._featurelayout.default,
  ..._text.default,
  ..._header.default,
  ..._list.default,
  ..._debug.default,
  ..._paragraph.default,
  ..._image.default,
  ..._link.default,
  ..._loader.default,
  ..._button.default,
  ..._messages.default,
  ..._inputtext.default,
  ..._inputpassword.default,
  ..._inputcheck.default,
  ..._inputdropdown.default,
  ..._inputfile.default
};
