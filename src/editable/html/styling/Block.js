
export const getStyle = props => ({
  background: (props.background ? props.background : undefined),
  boxSizing: (typeof props.boxSizing !== 'undefined' ? props.boxSizing : undefined),
  border: (typeof props.border !== 'undefined' ? props.border : undefined),
  borderTop: (typeof props.borderTop !== 'undefined' ? props.borderTop : undefined),
  borderLeft: (typeof props.borderLeft !== 'undefined' ? props.borderLeft : undefined),
  borderRight: (typeof props.borderRight !== 'undefined' ? props.borderRight : undefined),
  borderBottom: (typeof props.borderBottom !== 'undefined' ? props.borderBottom : undefined),
  borderColor: (typeof props.borderColor !== 'undefined' ? props.borderColor : undefined),
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
  marginTop: (typeof props.marginTop !== 'undefined' ? props.marginTop : undefined),
  marginBottom: (typeof props.marginBottom !== 'undefined' ? props.marginBottom : undefined),
  marginLeft: (typeof props.marginLeft !== 'undefined' ? props.marginLeft : undefined),
  marginRight: (typeof props.marginRight !== 'undefined' ? props.marginRight : undefined),
  textAlign: (props.textAlign ? props.textAlign : undefined),
  boxShadow: (props.boxShadow ? props.boxShadow : undefined),
  overflowX: (props.overflowX ? props.overflowX : undefined),
  overflowY: (props.overflowY ? props.overflowY : undefined)
});

export const getClasses = () => ([]);

export default { getStyle, getClasses };
