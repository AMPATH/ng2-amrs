import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Http } from '@angular/http';

@Injectable()
export class FakeVisitResourceService {
  returnErrorOnNext: boolean = false;
  constructor() {
  }

  getVisitEncounters(uuid: string): Observable<any> {
    let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let encounters = [
      {
        uuid: 'encounter-uuid',
        encounterDatetime: '2017-01-20T16:30:02.000+0300',
        form: {
          uuid: 'uuid',
          name: 'Triage Encounter Form v1.0'
        },
        encounterType: {
          uuid: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          display: 'TRIAGE'
        },
        provider: {
          uuid: 'provider-uuid',
          display: 'Unknown User'
        },
        obs: [
          {
            uuid: 'f3aace2b-6b19-4a31-8f09-2f27d8f9a223',
            concept: {
              uuid: 'a899e6d8-1350-11df-a1f1-0026b9348838',
              display: 'VITAL SIGNS'
            },
            Datetime: '2017-01-19T11:29:40.000+0300',
            groupMembers: [
              {
                uuid: '3bf24482-a6ec-4994-a24a-927ff65be0d6',
                display: 'BODY-MASS-INDEX-FOR-AGE Z-SCORE: 0.0',
                concept: {
                  uuid: '9061e5d5-8478-4d16-be44-bfec05b6705a',
                  display: 'BODY-MASS-INDEX-FOR-AGE Z-SCORE'
                },
                value: 0
              },
              {
                uuid: '340a949e-2d30-4e26-aeb2-19f858711ad1',
                display: 'WEIGHT (KG): 123.0',
                concept: {
                  uuid: 'a8a660ca-1350-11df-a1f1-0026b9348838',
                  display: 'WEIGHT (KG)'
                },
                voided: false,
                value: 123
              },
              {
                uuid: 'dd0ef26e-009e-4de6-ad88-7eedf779fe0a',
                display: 'HEIGHT (CM) 154',
                concept: {
                  uuid: 'a8a6619c-1350-11df-a1f1-0026b9348838',
                  display: 'HEIGHT (CM) 154'
                },
                voided: false,
                value: 154
              },

              {
                uuid: '8dccb9f9-2647-4b94-8697-178b13c26024',
                display: 'DIASTOLIC BLOOD PRESSURE: 101.0',
                concept: {
                  uuid: 'a8a65e36-1350-11df-a1f1-0026b9348838',
                  display: 'DIASTOLIC BLOOD PRESSURE'
                },
                voided: false,
                value: 101
              }
            ]
          }
        ]
      }
    ];


    if (!this.returnErrorOnNext) {
      test.next(encounters);
    } else {
      test.error(new Error('Error loading patient'));
    }
    return test.asObservable();
  }

  getVisitByUuid(uuid: string, urlParams: any): Observable<any> {

    let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let visit = {
      uuid: 'visit-uuid',
      startDatetime: '2017-01-20T16:29:45.000+0300',
      stopDatetime: '2017-01-20T16:30:45.000+0300'
    };

    if (!this.returnErrorOnNext) {
      return Observable.of(visit);
    } else {
      setTimeout(function () {
        test.error(new Error('Error loading patient'));
      }, 500);
      return test.asObservable();
    }

  }

  getPatientVisits(uuid: string): Observable<any> {
    let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let visits = [
      {
        uuid: 'uuid',
        encounters: [
          {
            uuid: 'encounter-uuid',
            encounterDatetime: '2017-01-20T16:30:02.000+0300',
            form: {
              uuid: 'uuid',
              name: 'Triage Encounter Form v1.0'
            }, encounterType: {
              uuid: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
              display: 'TRIAGE'
            },
            provider: {
              uuid: '5b6e58ea-1359-11df-a1f1-0026b9348838',
              display: 'Unknown User'
            }
          }
        ],
        patient: {
          uuid: 'uuid'
        },
        visitType: {
          uuid: 'uuid',
          name: 'RETURN HIV CLINIC VISIT'
        },
        location: {
          uuid: 'uuid',
          display: 'Room 7'
        },
        startDatetime: '2017-01-20T16:29:45.000+0300',
        stopDatetime: null
      }
    ];
    if (!this.returnErrorOnNext) {
      setTimeout(function () {
        test.next(visits);
      }, 500);
    } else {
      setTimeout(function () {
        test.error(new Error('Error loading patient'));
      }, 500);
    }
    return test.asObservable();
  }

}
