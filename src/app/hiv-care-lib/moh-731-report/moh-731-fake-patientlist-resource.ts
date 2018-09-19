import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

Injectable();
export class Moh731PatientListResourceService {
  constructor() {
  }

  public getMoh731PatientListReport(params): Observable<any> {
    return of({
      'startIndex': 0,
      'size': 2,
      'locations': [
        {
          uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
          display: 'MTRH Module 1'
        },
        {
          uuid: '08f45e7c-1352-11df-a1f1-0026b9348838',
          display: 'MTRH Module 2'
        }
      ],
      'indicators': [
        {
          indicator: 'currently_in_care_total',
          label: 'Currently in care total',
          ref: ''
        },
        {
          indicator: 'arv_first_regimen_start_date',
          label: 'ARV first regimen start date',
          ref: ''
        },
        {
          indicator: 'enrollment_date',
          label: 'Enrollment Date',
          ref: ''
        },
      ],
      'result': [{
        'person_id': 826446,
        'encounter_id': 6746346,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': '5b9b8f8c-edda-42fb-b9b5-7dc8690ebfcd',
        'gender': 'F',
        'birthdate': '1986-03-26T21:00:00.000Z',
        'age': 31,
        'has_pending_vl_test': 0,
        'enrollment_date': '2017-03-19T21:00:00.000Z',
        'hiv_start_date': '2017-03-19T21:00:00.000Z',
        'arv_start_location': 1,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': '2017-03-19T21:00:00.000Z',
        'cur_arv_line': 1,
        'vl_1': null,
        'vl_1_date': null,
        'person_name': 'patient name',
        'identifiers': 'identifier 1'
      }, {
        'person_id': 828123,
        'encounter_id': 6743341,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': 'cc5e579e-02fb-4de6-b4b0-d202e77a2d76',
        'gender': 'M',
        'birthdate': '1968-12-31T21:00:00.000Z',
        'age': 48,
        'has_pending_vl_test': 0,
        'enrollment_date': '2017-03-17T09:43:41.000Z',
        'hiv_start_date': '2017-03-16T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': null,
        'vl_1': null,
        'vl_1_date': null,
        'person_name': 'patient name',
        'identifiers': 'identifier 2'
      }]
    });
  }
}
