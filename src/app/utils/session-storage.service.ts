import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {
  getItem(keyName: string): string {
    return window.sessionStorage.getItem(keyName);
  }

  setItem(keyName: string, value: string): void {
    window.sessionStorage.setItem(keyName, value);
  }

  getObject(keyName: string): any {
    let stored = window.sessionStorage.getItem(keyName);
    try {
      let object = JSON.parse(stored);
      return object;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  setObject(keyName: string, value: any) {
    window.sessionStorage.setItem(keyName, JSON.stringify(value));
  }

  remove(keyName: string): void {
    window.sessionStorage.removeItem(keyName);
  }

  clear(): void {
    window.sessionStorage.clear();
  }

  get storageLength(): number {
    return window.sessionStorage.length;
  }
}
