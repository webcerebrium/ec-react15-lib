import'./Logger.mock';
import { objectPathExists, getObjectPathValue, deepFind, deepSet } from './DocumentObject';

describe('objectPathExists', () => {
  it('should confirm path', () => {
    const obj = { one: { two: 2 }};
    expect(objectPathExists(obj, 'one.two')).toEqual(true);
  });
  it('should return false on missing path', () => {
    const obj = { one: { two: 2 }};
    expect(objectPathExists(obj, 'one.or')).toEqual(false);
  });
  it('should return false on missing path, deeper', () => {
    const obj = { one: { two: 2 }};
    expect(objectPathExists(obj, 'one.or.another')).toEqual(false);
  });
});

describe('deepFind', () => {
  it('should find smth, one level', () => {
    const obj = { one: { two: 2 }};
    expect(deepFind(obj, 'one')).toEqual({ two: 2 });
  });
  it('should not find missing, one level', () => {
    const obj = { one: { two: 2 }};
    expect(deepFind(obj, 'boom')).toBeUndefined();
  });
  it('should find smth', () => {
    const obj = { one: { two: 2 }};
    expect(deepFind(obj, 'one.two')).toEqual(2);
  });
  it('should not fail on missing deep', () => {
    const obj = { one: { two: 2 }};
    expect(deepFind(obj, 'one.two.three.four')).toBeUndefined();
  });
})
