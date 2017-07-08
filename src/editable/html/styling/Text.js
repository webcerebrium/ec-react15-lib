
export const getStyle = props => ({
  color: (props.color ? props.color : undefined),
  textDecoration: (props.textDecoration ? props.textDecoration : undefined),
  textIndent: (props.textIndent ? props.textIndent : undefined),
  textShadow: (props.textShadow ? props.textShadow : undefined),
  textOverflow: (props.textOverflow ? props.textOverflow : undefined),
  fontStyle: (props.fontStyle ? props.fontStyle : undefined),
  fontWeight: (props.fontWeight ? props.fontWeight : undefined),
  fontSize: (props.fontSize ? props.fontSize : undefined),
  fontFamily: (props.fontFamily ? props.fontFamily : undefined),
  whiteSpace: (props.whiteSpace ? props.whiteSpace : undefined),
  wordSpacing: (props.wordSpacing ? props.wordSpacing : undefined),
  lineHeight: (props.lineHeight ? props.lineHeight : undefined)
});

export const getClasses = () => ([]);

export default { getStyle, getClasses };
