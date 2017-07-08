export const getStyle = props => ({
  top: (props.top ? props.top : undefined),
  bottom: (props.bottom ? props.bottom : undefined),
  left: (props.left ? props.left : undefined),
  right: (props.right ? props.right : undefined)
});

export const getClasses = () => ([]);

export default { getStyle, getClasses };
