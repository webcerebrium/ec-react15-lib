import { matchConditions } from './../../../services/DocumentCondition';

export const getStyle = () => ({
});

export const getClasses = (props, context) => {
  if (!props) return [];
  const arrClasses = [];
  if (props._id) arrClasses.push(`id-${props._id}`);
  if (props.class) arrClasses.push(props.class); // should we split them
  if (props.className) arrClasses.push(props.className); // lets support both?

  const display = props.display;
  if (!display) return arrClasses;
  const when = display.when;
  if (!when || when === 'always') return arrClasses;
  if (when === 'never') { arrClasses.push('hidden'); return arrClasses; }
  if (when === 'if' && display.conditions && display.conditions.length) {
    if (!matchConditions(props, display.conditions, context)) {
      arrClasses.push('hidden');
    }
  }
  return arrClasses;
};

export default { getStyle, getClasses };
