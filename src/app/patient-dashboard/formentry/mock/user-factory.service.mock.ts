import { Injectable } from '@angular/core';

@Injectable()
export class FakeUserFactory {
  constructor() {
  }

  public getLoggedInUser(): any {
    return null;
  }
}
