import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {
  public getItem(keyName: string): string {
    return window.sessionStorage.getItem(keyName);
  }

  public setItem(keyName: string, value: string): void {
    window.sessionStorage.setItem(keyName, value);
  }

  public getObject(keyName: string): any {
    const stored = window.sessionStorage.getItem(keyName);
    try {
      const object = JSON.parse(stored);
      return object;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public setObject(keyName: string, value: any) {
    window.sessionStorage.setItem(keyName, JSON.stringify(value));
  }

  public remove(keyName: string): void {
    window.sessionStorage.removeItem(keyName);
  }

  public clear(): void {
    window.sessionStorage.clear();
  }

  get storageLength(): number {
    return window.sessionStorage.length;
  }
}
