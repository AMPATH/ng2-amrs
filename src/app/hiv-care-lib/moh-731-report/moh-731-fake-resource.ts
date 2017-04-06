import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

Injectable();
export class Moh731ResourceService {
  constructor() {
  }

  getMoh731Report(locationUuids: string, startDate: string, endDate: string,
                  isLegacyReport: boolean, isAggregated: boolean): Observable<any> {
    let subj = new Subject<any>();
    let that = this;
    setTimeout(function () {
      subj.error('A serious error occured');
      // subj.next(that.getTestData());
    }, 2000);

    return subj.asObservable();
  }
}
