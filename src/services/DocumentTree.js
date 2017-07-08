// import { Logger } from './Logger';

const isArray = arr => (Object.prototype.toString.call(arr) === '[object Array]');

export const getElementId = (elem) => {
  if (!elem) return false;
  if (elem.tagName === 'BODY' || elem.getAttribute('id') === 'DocumentRoot') return false;
  let id = '';
  elem.classList.forEach((className) => {
    if (className.indexOf('id-') === 0) id = className.substring(3);
  });
  return id;
};

export const findById = (root, id) => {
  if (!root || !id) return false;
  if (root._id === id) return root;
  let foundElement = null;
  Object.keys(root).find((key) => {
    if (isArray(root[key])) {
      root[key].forEach((elem) => {
        if (!foundElement) foundElement = findById(elem, id);
      });
      if (foundElement) return foundElement;
    }
    return false;
  });
  return foundElement;
};

export const forEveryNode = (root, callback) => {
  if (!root) return;
  /* eslint-disable no-restricted-syntax */
  for (const k in root) {
    if (typeof root[k] === 'object' && root[k]) {
      forEveryNode(root[k], callback);
    }
  }
  /* eslint-enable no-restricted-syntax */
  callback(root);
};


export const getElementLists = (element) => {
  // Logger.of('getElementLists').info('element=', element);
  const found = Object.keys(element).filter((key) => {
    return isArray(element[key]);
  });
  return found;
};

export const getParentsElement = (parentEl) => {
  let found = false;
  const elems = getElementLists(parentEl);
  elems.forEach((key) => {
    found = parentEl[key];
    return found;
  });
  return found;
};

export const elementHasChild = (element, id) => {
  let found = false;
  const elems = getElementLists(element);
  elems.forEach((key) => {
    const list = element[key];
    if (list.find((el) => { return el._id === id; })) found = key;
  });
  return found;
};

export const findParent = (root, id) => {
  if (!root || !id) return false;
  let found = null;
  forEveryNode(root, (element) => {
    if (elementHasChild(element, id)) { found = element; }
  });
  return found;
};

export const searchElements = (root, stringSearch) => {
  if (!root) return false;
  const foundElements = [];
  let isFound = false;
  forEveryNode(root, (element) => {
    Object.keys(element).forEach((key) => {
      if (key === 'type' || key === '_id' || key === 'value') {
        const searchValue = element[key].toLowerCase();
        if (searchValue.indexOf(stringSearch.toLowerCase()) !== -1 && !isFound) {
          isFound = true;
          foundElements.push(element);
        }
      }
    });
    isFound = false;
  });
  return foundElements;
};

export const getNewId = (m = Math, d = Date, h = 16, s = e => m.floor(e).toString(h)) => (
  s(d.now() / 1000) + ' '.repeat(6).replace(/./g, () => s(m.random() * h))
);

const getDocumentRoot = () => (document.getElementById('DocumentRoot')); // eslint-disable-line

const getOffset = (el) => {
  const bd = document.body; // eslint-disable-line
  const rect = el.getBoundingClientRect();
  return { top: rect.top + bd.scrollTop, left: rect.left + bd.scrollLeft };
};

export const getRectangleOf = (element, scale = 1.0) => {
  const offset = getOffset(getDocumentRoot());
  return {
    top: scale * (getOffset(element).top - parseInt(offset.top, 10)), // eslint-disable-line no-undef
    left: scale * (getOffset(element).left - parseInt(offset.left, 10)), // eslint-disable-line no-undef
    width: element.offsetWidth * scale, // eslint-disable-line no-undef
    height: element.offsetHeight * scale // eslint-disable-line no-undef
  };
};

export const getRowset = (elem) => {
  if (!elem) return '';
  if (elem.getAttribute('rel')) return elem.getAttribute('rel');
  return getRowset(elem.parent);
};

export const findNodeFromXY = (nX, nY, scale = 1.0) => {
  let element = null; let rectangle = null; let rowset = '';
  const elements = document.querySelectorAll('#DocumentRoot *'); // eslint-disable-line no-undef
  elements.forEach((elem) => { // eslint-disable-line func-names
    if (!getElementId(elem)) return;
    const rect = getRectangleOf(elem, scale);
    if (nX >= rect.left && nX <= (rect.left + rect.width) && nY >= rect.top && nY <= (rect.top + rect.height)) {
      element = elem;
      rectangle = rect;
      // TRICKY: to find rowset - probably it should take a while to go
      // upper and upper until we meet the element with rel
      rowset = getRowset(elem);
    }
  });
  while (element && !getElementId(element)) element = element.parentNode;
  if (!element) return {};
  // console.log('findNodeFromXY x=', nX, 'y=', nY, 'element=', element);
  //if (element && (element.getAttribute('id') === 'DocumentRoot' || element.tagName === 'BODY')) return [];
  //const id = (element && element.getAttribute('id')) ? element.getAttribute('id') : '';

  // NOTE: element below is useless for editor, can be eliminated
  return { element, id: getElementId(element), rect: rectangle, rowset };
};

export const setValueById = (root, id, newObj) => {
  forEveryNode(root, (elem) => {
    if (elem && id && elem._id === id) {
      Object.keys(newObj).forEach((key) => {
        /* eslint-disable no-param-reassign */
        if (key !== '_id' && key !== 'type') { elem[key] = newObj[key]; }
        /* eslint-enable no-param-reassign */
      });
    }
  });
};

const getIndexBefore = (list, before) => {
  let index = 0;
  if (before) { list.forEach((elem, i) => { if (i === (before + 1)) { index = i; } }); }
  return index;
};

export const insertNode = (root, elementTemplate, targetContainer) => {
  if (!targetContainer.id) return;
  forEveryNode(root, (elem) => {
    if (elem && elem._id === targetContainer.id) {
      const list = elem[targetContainer.list];
      const destinationIndex = getIndexBefore(elem[targetContainer.list], targetContainer.before);
      list.splice(destinationIndex, 0, Object.assign({}, elementTemplate, { _id: getNewId() }));
    }
  });
};

export default {
  findById,
  setValueById,
  forEveryNode,
  insertNode,
  getNewId,
  getRectangleOf,
  findNodeFromXY,
  findParent,
  getElementLists,
  searchElements
};

