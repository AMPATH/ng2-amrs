import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  Http, Response, Headers, BaseRequestOptions,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { Moh731PatientListResourceService } from './moh-731-patientlist-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { of } from 'rxjs';

const expectedPatientListResult = {
  startIndex: 0,
  size: 1,
  result: [
    {
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
      'person_name': 'test name',
      'identifiers': '123'
    }
  ]
};

export class FakeDataCacheService {
  cacheRequest() {
    return of(expectedPatientListResult);
  }
}

export class FakeAppSettingsService {
  getEtlRestbaseurl() {
    return 'base-url/';
  }
}

// describe('Service: Moh731PatientListResourceService', () => {
//   let service: Moh731PatientListResourceService;
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [],
//       declarations: [],
//       providers: [
//         MockBackend,
//         BaseRequestOptions,
//         LocalStorageService,
//         {
//           provide: Http,
//           useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backendInstance, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions]
//         },
//         {
//           provide: AppSettingsService,
//           useClass: FakeAppSettingsService
//         },
//         {
//           provide: DataCacheService,
//           useClass: FakeDataCacheService
//         },
//         {
//           provide: Moh731PatientListResourceService,
//           useFactory: (http: Http, appSettingsService: AppSettingsService,
//                        dataCacheService: DataCacheService) => {
//             return new Moh731PatientListResourceService(http, appSettingsService,
//               dataCacheService);
//           },
//           deps: [Http, AppSettingsService, DataCacheService]
//         }
//       ],
//     });
//     service = TestBed.get(Moh731PatientListResourceService);
//   }));

//   afterEach(() => {
//     TestBed.resetTestingModule();
//   });

//   it('should be able to instantiate the service', (done) => {
//     expect(service).toBeTruthy();
//     done();
//   });

//   it('should have all the methods defined', (done) => {
//     expect(service.getPatientListUrl).toBeDefined();
//     expect(service.getUrlRequestParams).toBeDefined();
//     expect(service.getMoh731PatientListReport).toBeDefined();
//     done();
//   });

//   it('should call the API with correct url params when getMoh731PatientListReport() is called',
//     fakeAsync(() => {
//       let backend: MockBackend = TestBed.get(MockBackend);
//       backend.connections.subscribe((connection: MockConnection) => {
//         expect(connection.request.method).toBe(RequestMethod.Get);
//         expect(connection.request.url).toContain('startIndex');
//         expect(connection.request.url).toContain('endDate');
//         expect(connection.request.url).toContain('startDate');
//         expect(connection.request.url).toContain('reportName');
//         expect(connection.request.url).toContain('indicator');
//         expect(connection.request.url).toContain('locationUuids');
//         expect(connection.request.url).toContain('limit');
//         connection.mockRespond(new Response(
//           new ResponseOptions({
//               body: expectedPatientListResult
//             }
//           )));
//       });
//       service.getMoh731PatientListReport({
//         'startIndex': 0,
//         'isLegacy': true,
//         'endDate': '2017-03-19T21:00:00',
//         'startDate': '2016-03-19T21:00:00',
//         'indicator': 'indicator',
//         'reportName': 'reportName',
//         'locationUuids': '1234',
//         'limit': 20
//       }).subscribe((result) => {});
//       tick(50);
//     })
//   );

//   it('should call the correct API url given a set of params',
//     fakeAsync(() => {
//       let backend: MockBackend = TestBed.get(MockBackend);
//       backend.connections.subscribe((connection: MockConnection) => {
//         expect(connection.request.url).toEqual('base-url/MOH-731-report/patient-list?' +
//           'startIndex=0&endDate=2017-03-19T21:00:00&startDate=2016-03-19T21:00:00' +
//           '&reportName=MOH-731-report&indicator=indicator&locationUuids=1234&limit=20');
//         connection.mockRespond(new Response(
//           new ResponseOptions({
//               body: expectedPatientListResult
//             }
//           )));
//       });
//       service.getMoh731PatientListReport({
//         'startIndex': 0,
//         'isLegacy': true,
//         'endDate': '2017-03-19T21:00:00',
//         'reportName': 'MOH-731-report',
//         'startDate': '2016-03-19T21:00:00',
//         'indicator': 'indicator',
//         'locationUuids': '1234',
//         'limit': 20
//       }).subscribe((result) => {});
//       tick(50);
//     })
//   );

//   it('should return a report with correct structure from the API call',
//     fakeAsync(() => {
//       let backend: MockBackend = TestBed.get(MockBackend);
//       backend.connections.subscribe((connection: MockConnection) => {
//         connection.mockRespond(new Response(
//           new ResponseOptions({
//               body: expectedPatientListResult
//             }
//           )));
//       });
//       service.getMoh731PatientListReport({
//         'startIndex': 0,
//         'isLegacy': true,
//         'endDate': '2017-03-19T21:00:00',
//         'startDate': '2016-03-19T21:00:00',
//         'indicator': 'indicator',
//         'reportName': 'MOH-731-report',
//         'locationUuids': '1234',
//         'limit': 20
//       }).subscribe((result) => {
//         expect(result).toEqual(expectedPatientListResult);
//       });
//       tick(50);
//     })
//   );

// });
