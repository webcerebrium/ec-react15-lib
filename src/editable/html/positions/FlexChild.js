
export const validatePosition = () => {
  const allowed = ['flex', 'alignSelf', 'flexGrow', 'flexShrink', 'flexBasis', 'order'];
  return allowed;
};

export const getPositionStyles = (props) => {
  const arrFixedStyles = {
    flex: (props.flex ? props.flex : undefined),
    alignSelf: (props.alignSelf ? props.alignSelf : undefined),
    flexGrow: (props.flexGrow ? props.flexGrow : undefined),
    flexShrink: (props.flexShrink ? props.flexShrink : undefined),
    flexBasis: (props.flexBasis ? props.flexBasis : undefined),
    order: (props.order ? props.order : undefined)
  };
  return arrFixedStyles;
};

export const getPositionClasses = () => ([]);

export default { validatePosition, getPositionStyles, getPositionClasses };
