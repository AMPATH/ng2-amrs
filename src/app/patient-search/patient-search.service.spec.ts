/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { PatientSearchService } from './patient-search.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { Patient } from '../models/patient.model';
import { FakePatientResourceService } from '../openmrs-api/fake-patient-resource';

describe('Service: PatientSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientSearchService,
        {
          provide: PatientResourceService, useFactory: () => {
            return new FakePatientResourceService(null, null);
          }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    let service: PatientSearchService = TestBed.get(PatientSearchService);
    expect(service).toBeTruthy();
  });


  it('should search for patients by search text', () => {
    let service: PatientSearchService = TestBed.get(PatientSearchService);
    let result = service.searchPatient('text', false);

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].uuid).toEqual('uuid');
    });

  });


  it('should return an error when patient search is not successful', (done) => {
    let service: PatientSearchService = TestBed.get(PatientSearchService);
    let fakeRes: FakePatientResourceService =
      TestBed.get(PatientResourceService) as FakePatientResourceService;

    // tell mock to return error on next call
    fakeRes.returnErrorOnNext = true;
    let results = service.searchPatient('text', false);

    results.subscribe((result) => {
    },
      (error) => {
        // when it gets here, then it returned an error
        done();
      });

  });
});
