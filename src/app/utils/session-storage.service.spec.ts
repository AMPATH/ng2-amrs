import { SessionStorageService } from './session-storage.service';

describe('LocalStorageService Tests', () => {
  let service: SessionStorageService;
  const keyName = 'sessionStorageServiceTest.value';
  const value = 'some value to be stored';
  const objectValue = {
    property1: 'sessionStorage wrapper',
    property2: 'another property'
  };

  beforeEach(() => {
    service = new SessionStorageService();
  });

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('should store a given value', () => {
    service.setItem(keyName, value);
    let v;
    try {
      v = window.sessionStorage.getItem(keyName);
    } catch (e) {
      console.error('Error getting item', e);
    }
    expect(v).toEqual(value, 'setItem() should store values');
  });

  it('should return the correct length of sessionStorage', () => {
    window.sessionStorage.setItem(keyName, 'some value');
    expect(service.storageLength).toEqual(1);
  });

  it('should store javascript object literals', () => {
    service.setObject(keyName, objectValue);
    const stored = window.sessionStorage.getItem(keyName);
    expect(JSON.parse(stored)).toEqual(objectValue, 'setObject()');
  });

  it('should retrieve a stored value', () => {
    try {
      window.sessionStorage.setItem(keyName, value);
    } catch (e) {
      console.error('Error getting item', e);
    }
    expect(service.getItem(keyName)).toEqual(value, 'getItem()');
  });

  it('should remove an existing item', () => {
    window.sessionStorage.setItem(keyName, 'some value');
    service.remove(keyName);
    expect(window.sessionStorage.getItem(keyName)).toBeNull();
  });

  it('should clear localStorage', () => {
    service.clear();
    expect(window.sessionStorage.length).toEqual(0);
  });

  it('should retrieve the stored javascript object literal', () => {
    window.sessionStorage.setItem(keyName, JSON.stringify(objectValue));
    expect(service.getObject(keyName)).toEqual(objectValue, 'getObject()');
  });
});
