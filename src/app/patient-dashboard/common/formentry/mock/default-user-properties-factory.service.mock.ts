import { Injectable } from '@angular/core';

@Injectable()
export class FakeDefaultUserPropertiesFactory {
  constructor() {
  }

  public getCurrentUserDefaultLocationObject(): any {
    return { uuid: 'test-uuid', value: 'test-uuid'};
  }

  public getUserProperty() {
    return { value: 'test-uuid' };
  }
}
