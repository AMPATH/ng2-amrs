/* tslint:disable:no-unused-variable */

import { TestBed, async , fakeAsync } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../../app-settings';
import {
  VisitResourceService
} from '../../../openmrs-api/visit-resource.service';
import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { FakeVisitResourceService } from '../../../openmrs-api/fake-visit-resource.service';
describe('Service: TodaysVitalsService', () => {
  beforeEach(fakeAsync (() => {
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

  it('should get todays vitals based on todays triage encounters', (done) => {
    let mockCdmTriageEncounterDetails: any = [
      {
        'uuid': '61720d43-c94b-4db7-8616-58c2075e847f',
        'encounterDatetime': '2018-02-07T14:10:10.000+0300',
        'patient': {
          'uuid': 'bad1e162-cd75-45c6-97f8-13a6a4d6ce01',
        },
        'form': {
          'uuid': '01a4470b-2cf8-4609-a0f2-e4a849f2a1cc',
          'name': 'CDM POC Triage Form v1.0'
        },
        'visit': {
          'uuid': '82e98be8-c1ce-4e79-803e-65b23e863436',
          'visitType': {
            'uuid': 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
            'display': 'RETURN HIV CLINIC VISIT',
            'encounterType': {
              'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
              'display': 'CDMTRIAGE',
            }
          }
        },
        'obs': [
              {
                'uuid': 'e3832597-e95f-4870-b176-3f7803b3e142',
                'obsDatetime': '2018-02-07T14:10:10.000+0300',
                'concept': {
                  'uuid': 'a8a65f12-1350-11df-a1f1-0026b9348838',
                  'name': {
                    'display': 'PULSE'
                  }
                },
                'value': 87,
                'groupMembers': null
              },
              {
                'uuid': '03ef064b-c8b0-4b45-9b04-c7340c2eecb6',
                'obsDatetime': '2018-02-07T14:10:10.000+0300',
                'concept': {
                  'uuid': 'a8a65fee-1350-11df-a1f1-0026b9348838',
                  'name': {
                    'display': 'TEMPERATURE (C)'
                  }
                },
                'value': 36.5,
                'groupMembers': null
              },
              {
                'uuid': '33659dda-36a1-4888-a792-7b168f30a6ff',
                'obsDatetime': '2018-02-07T14:10:10.000+0300',
                'concept': {
                  'uuid': 'a8a65e36-1350-11df-a1f1-0026b9348838',
                  'name': {
                    'display': 'DIASTOLIC BLOOD PRESSURE'
                  }
                },
                'value': 71,
                'groupMembers': null
              },
              {
                'uuid': '8c5fa997-d798-4139-9e5a-1059c90442e8',
                'obsDatetime': '2018-02-07T14:10:10.000+0300',
                'concept': {
                  'uuid': 'a8a66354-1350-11df-a1f1-0026b9348838',
                  'name': {
                    'display': 'BLOOD OXYGEN SATURATION'
                  }
                },
                'value': 97,
                'groupMembers': null
              },
              {
                'uuid': '878c945d-01ef-4e86-a476-8310a71c7f46',
                'obsDatetime': '2018-02-07T14:10:10.000+0300',
                'concept': {
                  'uuid': 'a8a660ca-1350-11df-a1f1-0026b9348838',
                  'name': {
                    'display': 'WEIGHT (KG)'
                  }
                },
                'value': 68.8,
                'groupMembers': null
              },
              {
                'uuid': 'b9746277-0593-462b-9119-85cc6f740708',
                'obsDatetime': '2018-02-07T14:10:10.000+0300',
                'concept': {
                  'uuid': 'a8a65d5a-1350-11df-a1f1-0026b9348838',
                  'name': {
                    'display': 'SYSTOLIC BLOOD PRESSURE'
                  }
                },
                'value': 128,
                'groupMembers': null
              }
            ]
      }
    ];

    let service: TodaysVitalsService = TestBed.get(TodaysVitalsService);
    let fakeRes: FakeVisitResourceService =
      TestBed.get(VisitResourceService) as FakeVisitResourceService;
    fakeRes.returnErrorOnNext = false;
    // let vitals = service.getTodaysVitals(mockCdmTriageEncounterDetails);

    service.getTodaysVitals(mockCdmTriageEncounterDetails).then((results: any) => {
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].diastolic).toEqual(71);
      expect(results[0].weight).toEqual(68.8);
      expect(results[0].height).toEqual(null);
      expect(results[0].bmi).toEqual(null);
      done();
    });

  });

});

