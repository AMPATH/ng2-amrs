import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable } from 'rxjs/Rx';
import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import * as _ from 'lodash';

@Injectable()
export class DailyScheduleService {
  constructor(private dailyScheduleResource: DailyScheduleResourceService) { }


  getDailyVisits(params): Observable<any[]> {
    let scheduledPatients: Subject<any[]> = new Subject<any[]>();
    let visitsObservable = this.dailyScheduleResource.
      getDailyVisits(params);

    if (visitsObservable === null) {
      throw 'Null daily visits observable';
    } else {
      visitsObservable.subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            scheduledPatients.next(patientList);
          } else {
            scheduledPatients.next([]);
          }
        }
        ,
        (error) => {
          scheduledPatients.error(error);
        }
      );
    }
    return scheduledPatients.asObservable();
  }

  getDailyHasNotReturned(params): Observable<any[]> {
    let scheduledPatients: Subject<any[]> = new Subject<any[]>();
    let hasNotReturnedObservable = this.dailyScheduleResource.
      getDailyHasNotReturned(params);

    if (hasNotReturnedObservable === null) {
      throw 'Null daily Has Not Returned observable';
    } else {
      hasNotReturnedObservable.subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            scheduledPatients.next(patientList);
          } else {
            scheduledPatients.next([]);
          }
        }
        ,
        (error) => {
          scheduledPatients.error(error);
        }
      );
    }
    return scheduledPatients.asObservable();
  }

  getDailyAppointments(params): Observable<any[]> {
    let scheduledPatients: Subject<any[]> = new Subject<any[]>();
    let appointmentsObservable = this.dailyScheduleResource.
      getDailyAppointments(params);

    if (appointmentsObservable === null) {
      throw 'Null daily appointments observable';
    } else {
      appointmentsObservable.subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            scheduledPatients.next(patientList);
          } else {
            scheduledPatients.next([]);
          }
        }
        ,
        (error) => {
          scheduledPatients.error(error);
        }
      );
    }
    return scheduledPatients.asObservable();
  }

}
