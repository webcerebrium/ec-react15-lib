
export const getStyle = props => ({
  flexFlow: (props.flexFlow ? props.flexFlow : undefined),
  flexDirection: (props.flexDirection ? props.flexDirection : undefined),
  flexWrap: (props.flexWrap ? props.flexWrap : undefined),
  alignItems: (props.alignItems ? props.alignItems : undefined),
  alignContent: (props.alignContent ? props.alignContent : undefined),
  justifyContent: (props.justifyContent ? props.justifyContent : undefined)
});

export const getClasses = () => ([]);

export default { getStyle, getClasses };
