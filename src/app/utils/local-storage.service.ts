import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  getItem(keyName: string): string {
    return window.localStorage.getItem(keyName);
  }

  setItem(keyName: string, value: string): void {
    window.localStorage.setItem(keyName, value);
  }

  getObject(keyName: string): any {
    let stored = window.localStorage.getItem(keyName);
    try {
      let object = JSON.parse(stored);
      return object;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  setObject(keyName: string, value: any) {
    window.localStorage.setItem(keyName, JSON.stringify(value));
  }

  remove(keyName: string): void {
    window.localStorage.removeItem(keyName);
  }

  clear(): void {
    window.localStorage.clear();
  }

  get storageLength(): number {
    return window.localStorage.length;
  }
}
