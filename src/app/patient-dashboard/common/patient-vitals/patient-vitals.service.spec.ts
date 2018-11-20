/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { PatientVitalsService } from './patient-vitals.service';
import { VitalsResourceService } from '../../../etl-api/vitals-resource.service';

// describe('Service: PatientVitalsService', () => {

//   let service: PatientVitalsService,
//     vitals: Observable<any>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         PatientVitalsService,
//         VitalsResourceService,
//         MockBackend,
//         LocalStorageService,
//         BaseRequestOptions,
//         {
//           provide: Http,
//           useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backendInstance, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions]
//         },
//          AppSettingsService
//       ]
//     });
//       service = TestBed.get(PatientVitalsService);
//       vitals = service.getvitals('de662c03-b9af-4f00-b10e-2bda0440b03b', 0);


//   });

//   afterEach(() => {
//     TestBed.resetTestingModule();
//   });

//   it('should create an instance', () => {
//     expect(service).toBeTruthy();
//   });


//   it('should load Patient Vitals', (done) => {
//     vitals.subscribe((results) => {
//       if (results) {
//       expect(results).toBeTruthy();
//       expect(results.length).toBeGreaterThan(0);
//       expect(results[0].uuid).toEqual('uuid');
//       }
//       done();
//     });

//   });

//   it('should return an error when load patient vitals is not successful', (done) => {
//     let backend: MockBackend = TestBed.get(MockBackend);

//     let patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';

//     backend.connections.subscribe((connection: MockConnection) => {

//       expect(connection.request.url)
//         .toBe('https://amrsreporting.ampath.or.ke:8002/etl/patient/'
//         + patientUuid + '/vitals?startIndex=0&limit=10');


//       connection.mockError(new Error('An error occured while processing the request'));
//     });
//     service.getvitals(patientUuid, 0)
//       .subscribe((response) => {
//     },
//       (error: Error) => {
//         expect(error).toBeTruthy();
//       });
//       done();
//   });
// });
