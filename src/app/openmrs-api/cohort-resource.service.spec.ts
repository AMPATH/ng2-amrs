import { async, inject , TestBed } from '@angular/core/testing';
import {  BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { CohortResourceService  } from './cohort-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';

describe('Service : CohortResourceService Unit Tests', () => {

     beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [
                CohortResourceService,
                MockBackend,
                BaseRequestOptions,
                    {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                LocalStorageService
                ]

           });


      });

    let mockAllCohortsResponse = {
                'uuid': 'uuid',
                'display': 'adult',
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
                    }
                ]
            };

let uuid = 'uuid';

let mockCohortResponse = {
            'uuid': 'uuid',
            'name': 'Test Defaulter List',
            'description': 'Test Defaulter List',
            'voided': false,
            'memberids': {
                'int': [
                    '123456',
                    '123456'
                ]
            },
            'links': {
                'link': [
                     {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
            },
            {
                'rel': 'full',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
            }
                ]
            },
            'resourceversion': '1.8'
  };

  let addCohortPayload = {
      'name': 'Test Defaulter List',
      'description': 'Test Defaulter List',
      'memberIds': [1234, 1234]
 };

  let addCohortResponse = {
      'uuid': 'cd29a1fa-896e-4ef5-b97f-e13c1490aa07',
      'display': 'Test Defaulter List',
      'name': 'Test Defaulter List',
      'description': 'Test Defaulter List',
      'voided': false,
      'memberIds': [1234],
      'links': [
          {
              'rel': 'self',
              'uri': 'https://testurl'
          },
          {
              'rel': 'full',
              'uri': 'https://test'
          }
      ],
      'resourceVersion': '1.8'
  };



  let editCohortPayload = {
       'name': 'Test Defaulter List',
       'description' : 'Test Defaulter List'
};

  let editCohortResponse = {
      'uuid': 'cd29a1fa-896e-4ef5-b97f-e13c1490aa07',
      'display': 'Test Defaulter List',
      'name': 'Test Defaulter List',
      'description': 'Test Defaulter List',
      'voided': false,
      'memberIds': [1234],
      'links': [
          {
              'rel': 'self',
              'uri': 'https://testurl'
          },
          {
              'rel': 'full',
              'uri': 'https://test'
          }
      ],
      'resourceVersion': '1.8'
  };

  let retireCohortResponse = {
  };

    it('should construct Cohort Service', async(inject(
                 [CohortResourceService, MockBackend], (service, mockBackend) => {
                 expect(service).toBeDefined();
      })));

    it('Should return null in get cohort with no parameter', async(inject(
            [CohortResourceService, MockBackend], (service, mockBackend) => {

                let response = service.getCohort(null);

                expect(response).toBeNull();

    })));
describe('Get All Cohorts', () => {

    it('should hit right endpoint for getallCohorts and get right response', async(inject(
           [CohortResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('ws/rest/v1/cohort');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                });

                 service.getAllCohorts().subscribe(res => {
                         expect(res).toEqual(mockAllCohortsResponse);
                });

    })));

});

describe('Get Cohort', () => {

    it('should hit right endpoint for getCohort and get right response', async(inject(
           [CohortResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('ws/rest/v1/cohort/' + uuid );
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: mockCohortResponse })
                    ));
                });

                service.getCohort(uuid).subscribe(res => {
                    expect(res).toBe(mockCohortResponse);
                });

    })));


});


describe('Add Cohort', () => {

    it('should hit right endpoint for add Cohort and get right response', async(inject(
           [CohortResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('ws/rest/v1/cohort');
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: addCohortResponse  })
                    ));
                });

                service.addCohort(addCohortPayload).subscribe(res => {
                    expect(res).toBe(addCohortResponse );
                });

    })));


});

describe('Edit Cohort', () => {

    it('should hit right endpoint for edit Cohort and get right response', async(inject(
           [CohortResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('ws/rest/v1/cohort');
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: editCohortResponse  })
                    ));
                });

                service.editCohort(editCohortPayload).subscribe(res => {
                    expect(res).toBe(editCohortResponse);
                });

    })));


});

describe('Retire Cohort', () => {

    it('should hit right endpoint for drop Cohort and get right response', async(inject(
           [CohortResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('ws/rest/v1/cohort/' + uuid + '?!purge');
                    expect(conn.request.method).toBe(RequestMethod.Delete);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: retireCohortResponse  })
                    ));
                });

                service.retireCohort(uuid).subscribe(res => {
                    expect(res).toBe(retireCohortResponse);
                });

    })));


});

});
