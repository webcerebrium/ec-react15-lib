import { Logger } from './../../../services/Logger';

export const validatePosition = (props) => {
  const { position } = props;
  if (!position) {
    Logger.of('Grid.validatePosition').warn('position field is mandatory', props);
    return false;
  }
  if (!position.corner || !position.corner.length) {
    Logger.of('Fixed.validatePosition').warn('missing position.corner property', props);
    return false;
  }
  return ['position'];
};

export const getPositionStyles = (props) => {
  const arrFixedStyles = {};
  const { position } = props;
  if (position && position.corner) {
    ['left', 'right', 'top', 'bottom'].forEach((x) => {
      if (position.corner.indexOf(x) !== -1) arrFixedStyles[x] = position[x];
    });
  }
  return arrFixedStyles;
};

export const getPositionClasses = () => ([]);

export default { validatePosition, getPositionStyles, getPositionClasses };
