import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

Injectable();
export class Moh731ResourceService {
  constructor() {}

  public getMoh731Report(
    locationUuids: string,
    startDate: string,
    endDate: string,
    isLegacyReport: boolean,
    isAggregated: boolean
  ): Observable<any> {
    const subj = new Subject<any>();
    const that = this;
    setTimeout(() => {
      subj.error('A serious error occured');
      // subj.next(that.getTestData());
    }, 2000);

    return subj.asObservable();
  }
}
