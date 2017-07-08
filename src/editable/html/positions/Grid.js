import { Logger } from './../../../services/Logger';

export const validatePosition = (props) => {
  const allowed = [
    'xlColumn', 'xlOffset',
    'lgColumn', 'lgOffset',
    'mdColumn', 'mdOffset',
    'smColumn', 'smOffset',
    'xsColumn', 'xsOffset'
  ];
  const { position } = props;
  if (!position) {
    Logger.of('Grid.validatePosition').warn('position field is mandatory', props);
    return false;
  }
  const extra = [];
  Object.keys(position).forEach((field) => {
    if (allowed.indexOf(field) === -1) { extra.push(field); }
  });
  if (extra.length > 0) {
    Logger.of('Grid.validatePosition').warn('position fields are not allowed', extra);
    return false;
  }
  return ['position'];
};

export const getPositionStyles = () => ({});

export const getPositionClasses = (props) => {
  const { position } = props;
  const mapGridClasses = {
    xlColumn: 'col-xl',
    xlOffset: 'offset-xl',
    lgColumn: 'col-lg',
    lgOffset: 'offset-lg',
    mdColumn: 'col-md',
    mdOffset: 'offset-md',
    smColumn: 'col-sm',
    smOffset: 'offset-sm',
    xsColumn: 'col-xs',
    xsOffset: 'offset-xs'
  };
  const arrClasses = [];
  Object.keys(position).forEach((key) => {
    if (typeof mapGridClasses[key] !== 'undefined') {
      arrClasses.push(`${mapGridClasses[key]}-${position[key]}`);
    }
  });
  return arrClasses;
};

export default { validatePosition, getPositionStyles, getPositionClasses };
