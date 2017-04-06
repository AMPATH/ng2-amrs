import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

Injectable();
export class Moh731PatientListResourceService {
  constructor() {
  }

  getMoh731PatientList(params): Observable<any> {
    return Observable.of({
      'startIndex': 0,
      'size': 8,
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
      }, {
        'person_id': 828104,
        'encounter_id': 6742907,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': '905df776-c1a0-4816-a4a8-17fd64b2b550',
        'gender': 'M',
        'birthdate': '1976-12-31T21:00:00.000Z',
        'age': 40,
        'has_pending_vl_test': 0,
        'enrollment_date': '2017-03-17T07:59:39.000Z',
        'hiv_start_date': '2017-03-16T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': null,
        'vl_1': null,
        'vl_1_date': null,
        'person_name': 'patient name',
        'identifiers': 'identifier 3'
      }, {
        'person_id': 826789,
        'encounter_id': 6763884,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': '29341d28-5160-4446-a2db-cb322101c61f',
        'gender': 'F',
        'birthdate': '1986-01-31T21:00:00.000Z',
        'age': 31,
        'has_pending_vl_test': 0,
        'enrollment_date': '2017-02-20T11:09:59.000Z',
        'hiv_start_date': '2017-02-19T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': null,
        'vl_1': null,
        'vl_1_date': null,
        'person_name': 'patient name',
        'identifiers': 'identifier 4'
      }, {
        'person_id': 826468,
        'encounter_id': 6666886,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': 'f45a599a-d0c6-44db-838e-f23335ab827b',
        'gender': 'F',
        'birthdate': '1986-10-23T21:00:00.000Z',
        'age': 30,
        'has_pending_vl_test': 0,
        'enrollment_date': '2017-02-14T07:56:29.000Z',
        'hiv_start_date': '2017-02-13T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': null,
        'vl_1': 18340,
        'vl_1_date': '2017-02-13T21:00:00.000Z',
        'person_name': 'patient name',
        'identifiers': 'identifier 5'
      }, {
        'person_id': 440,
        'encounter_id': 6586007,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': '5b6f9002-1359-11df-a1f1-0026b9348838',
        'gender': 'F',
        'birthdate': '1986-12-11T21:00:00.000Z',
        'age': 30,
        'has_pending_vl_test': 0,
        'enrollment_date': '2003-01-23T21:00:00.000Z',
        'hiv_start_date': '2009-01-05T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': null,
        'vl_1': 0,
        'vl_1_date': '2016-02-09T21:00:00.000Z',
        'person_name': 'patient name',
        'identifiers': 'identifier 6'
      }, {
        'person_id': 14282,
        'encounter_id': 6516813,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': '5bb02c2a-1359-11df-a1f1-0026b9348838',
        'gender': 'M',
        'birthdate': '1959-12-31T21:00:00.000Z',
        'age': 57,
        'has_pending_vl_test': 0,
        'enrollment_date': '2005-06-23T21:00:00.000Z',
        'hiv_start_date': '2006-03-13T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': null,
        'vl_1': null,
        'vl_1_date': null,
        'person_name': 'patient name',
        'identifiers': 'identifier 7'
      }, {
        'person_id': 804592,
        'encounter_id': 6053861,
        'location_id': 1,
        'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'patient_uuid': '7e8d47f7-f1d1-481f-b6f9-ca59f98fadde',
        'gender': 'M',
        'birthdate': '1997-12-31T21:00:00.000Z',
        'age': 19,
        'has_pending_vl_test': 0,
        'enrollment_date': '2016-03-28T21:00:00.000Z',
        'hiv_start_date': '2016-03-28T21:00:00.000Z',
        'arv_start_location': null,
        'arv_first_regimen_start_date': null,
        'cur_regimen_arv_start_date': null,
        'cur_arv_line': 1,
        'vl_1': null,
        'vl_1_date': null,
        'person_name': 'patient name',
        'identifiers': 'identifier 8'
      }]
    });
  }
}
