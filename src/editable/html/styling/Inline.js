
export const getStyle = props => ({
  background: (props.background ? props.background : undefined),
  border: (typeof props.border !== 'undefined' ? props.border : undefined),
  borderRadius: (typeof props.borderRadius !== 'undefined' ? props.borderRadius : undefined),
  width: (props.width ? props.width : undefined),
  minWidth: (props.minWidth ? props.minWidth : undefined),
  maxWidth: (props.maxWidth ? props.maxWidth : undefined),
  height: (props.height ? props.height : undefined),
  minHeight: (props.minHeight ? props.minHeight : undefined),
  maxHeight: (props.maxHeight ? props.maxHeight : undefined),
  paddingTop: (typeof props.paddingTop !== 'undefined' ? props.paddingTop : undefined),
  paddingBottom: (typeof props.paddingBottom !== 'undefined' ? props.paddingBottom : undefined),
  paddingLeft: (typeof props.paddingLeft !== 'undefined' ? props.paddingLeft : undefined),
  paddingRight: (typeof props.paddingRight !== 'undefined' ? props.paddingRight : undefined),
  marginLeft: (typeof props.marginLeft !== 'undefined' ? props.marginLeft : undefined),
  marginRight: (typeof props.marginRight !== 'undefined' ? props.marginRight : undefined),
  boxShadow: (props.boxShadow ? props.boxShadow : undefined),
  overflowX: (props.overflowX ? props.overflowX : undefined),
  overflowY: (props.overflowY ? props.overflowY : undefined)
});

export const getClasses = () => ([]);

export default { getStyle, getClasses };
