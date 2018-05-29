import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FakeRetrospectiveDataEntryService {

  public retroSettings: BehaviorSubject<any> = new BehaviorSubject({
    enabled: false,
    error: {},
    location: {value: 'uuid'},
    provider: {value: 'uuid'},
    visitDate: '2018-05-23'});
  public enableRetro: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public errorState: BehaviorSubject<any> = new BehaviorSubject(null);
  public retroProvider: any;
  public retroVisitDate: string;
  public retroLocation: any;

  constructor() {
  }

  public updateProperty(): void {
  }

  public getProperty(name: string): any {
    return '';
  }

  public updateRetroSettings(): void {
    // get the defaults
  }

  public mappedLocation(location): any {
    return {
      value: 'uuid',
      label: 'display'
    };
  }
}
