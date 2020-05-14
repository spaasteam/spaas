import '@testing-library/jest-dom/extend-expect';

import { store, event } from '../src/index';

describe('store', () => {
  test('store', async () => {
    const warnMockFn = jest.fn();
    (global as any).console = {
      warn: warnMockFn,
    };

    // setStore getStore
    store.set('token', 'token string');
    const token = store.get('token');
    expect(token).toBe('token string');

    // get set
    store.set('user', { name: 'Tom', age: 11 });
    
    const userInfo = await store.get('user', async () => {
      return new Promise((resolve) => {
        resolve({})
      })
    });
    expect(userInfo.name).toBe('Tom');
    expect(userInfo.age).toBe(11);
  
    // get if exportStore not exist
    expect(store.hasStore('exportStores')).toBe(false);
    const exportStore = await store.get('exportStores', async () => {
      return new Promise((resolve) => {
        resolve({
          describe: 'if you don‘t own user, you will get this'
        })
      })
    });
    expect(exportStore.describe).toBe('if you don‘t own user, you will get this');

    // on off
    expect(store.has('language')).toBe(false);

    const changeLang = jest.fn();
    store.on('language', changeLang, true);
    expect(changeLang).toBeCalledWith(undefined);

    store.set('language', 'CH');
    expect(changeLang).toBeCalledWith('CH');
    store.set('language', 'EN');
    expect(changeLang).toBeCalledWith('EN');
    expect(changeLang).toBeCalledTimes(3);

    expect(store.has('language')).toBe(true);

    store.off('language', changeLang);
    expect(changeLang).toBeCalledTimes(3);
    expect(store.has('language')).toBe(false);

    store.set('language', changeLang);
    const changeLang2 = jest.fn();
    store.on('language', changeLang2, true);
    expect(changeLang2).toBeCalledTimes(1);
    expect(store.has('language')).toBe(true);
  });
});

describe('event', () => {
  test('event', () => {
    const warnMockFn = jest.fn();
    (global as any).console = {
      warn: warnMockFn,
    };

    const testFunc = jest.fn();
    const testFunc2 = jest.fn();

    expect(event.has('testEvent')).toBe(false);

    event.on('testEvent', testFunc);
    expect(event.has('testEvent')).toBe(true);

    event.emit('testEvent', 'testData');
    expect(testFunc).toBeCalledWith('testData');

    event.on('testEvent', testFunc2);
    expect(event.has('testEvent')).toBe(true);

    event.emit('testEvent', 'testData');
    expect(testFunc).toBeCalledWith('testData');
    expect(testFunc).toBeCalledTimes(2);
    expect(testFunc2).toBeCalledWith('testData');

    event.off('testEvent', testFunc);
    expect(event.has('testEvent')).toBe(true);

    event.emit('testEvent', 'testData');
    expect(testFunc).toBeCalledTimes(2);
    expect(testFunc2).toBeCalledWith('testData');
    expect(testFunc2).toBeCalledTimes(2);

    event.off('testEvent', testFunc2);
    expect(event.has('testEvent')).toBe(false);
  });
});
