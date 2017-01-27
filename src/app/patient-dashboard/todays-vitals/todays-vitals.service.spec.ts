/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../app-settings/app-settings.service';


import {
  VisitResourceService
} from '../../openmrs-api/visit-resource.service';
import { Vital } from '../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { FakeVisitResourceService } from '../../openmrs-api/fake-visit-resource.service';
describe('Service: TodaysVitalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VisitResourceService,
        DatePipe,

        TodaysVitalsService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,

        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: VisitResourceService, useFactory: () => {
            return new FakeVisitResourceService();
          }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    let service: TodaysVitalsService = TestBed.get(TodaysVitalsService);
    expect(service).toBeTruthy();
  });


  it('should get todays vitals by patient uuid', (done) => {
    let service: TodaysVitalsService = TestBed.get(TodaysVitalsService);
    let fakeRes: FakeVisitResourceService =
      TestBed.get(VisitResourceService) as FakeVisitResourceService;
    fakeRes.returnErrorOnNext = false;
    spyOn(service, 'getTodayVisits').and.callFake(function (params) {
      // assume the test data is today's vitals
      return params;
    });

    service.getTodaysVitals('patient-uuid').subscribe((results) => {
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].diastolic).toEqual(101);
      expect(results[0].weight).toEqual(123);
      expect(results[0].height).toEqual(154);
      expect(results[0].bmi).toEqual(51.9);
      done();
    });

  });

  it('should return an error when patient search is not successful', (done) => {
    let service: TodaysVitalsService = TestBed.get(TodaysVitalsService);
    let fakeRes: FakeVisitResourceService =
      TestBed.get(VisitResourceService) as FakeVisitResourceService;

    // tell mock to return error on next call
    fakeRes.returnErrorOnNext = true;
    let result = service.getTodaysVitals('patient-uuid');

    result.subscribe((results) => {
    },
      (error) => {
        // when it gets here, then it returned an error
        done();
      });

  });

});

