// /* tslint:disable:no-unused-variable */

// import { TestBed, async } from '@angular/core/testing';
// import { PatientBannerComponent } from './patient-banner.component';
// import { PatientService } from '../patient.service';
// import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
// import { Http, BaseRequestOptions } from '@angular/http';
// import { MockBackend } from '@angular/http/testing';
// describe('Component: PatientBanner', () => {
//   let component;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         PatientBannerComponent,
//         PatientService,
//         PatientResourceService,
//         {
//           provide: Http,
//           useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backendInstance, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions]
//         },
//       ]
//     });
//     component = TestBed.get(PatientBannerComponent);
//   });

//   it('should create an instance', () => {
//     expect(component).toBeTruthy();
//   });
// });
