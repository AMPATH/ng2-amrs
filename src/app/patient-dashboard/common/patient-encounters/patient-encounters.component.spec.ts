// /* tslint:disable:no-unused-variable */
// import { MockBackend } from '@angular/http/testing';
// import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
// import { TestBed, async } from '@angular/core/testing';
// import { PatientEncountersComponent } from './patient-encounters.component';
// import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
// import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
// import { PatientService } from '../patient.service';
// import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
// import {
//   ProgramEnrollmentResourceService
// } from '../../openmrs-api/program-enrollment-resource.service';
// import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
// import { AppSettingsService } from '../../app-settings/app-settings.service';
// import { LocalStorageService } from '../../utils/local-storage.service';
// import { PatientEncounterService } from './patient-encounters.service';
// describe('Component: PatientEncounters', () => {
//   let component;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         MockBackend,
//         BaseRequestOptions,
//         PatientEncountersComponent,
//         PatientService,
//         ProgramEnrollmentResourceService,
//         EncounterResourceService,
//         AppSettingsService,
//         LocalStorageService,
//         PatientResourceService,
//         PatientEncounterService,
//         PatientEncounterService,
//         {
//           provide: Http,
//           useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backendInstance, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions]
//         }
//       ]

//     });
//     component = TestBed.get(PatientEncountersComponent);
//   });

//   afterEach(() => {
//     TestBed.resetTestingModule();
//   });
//   it('should create an instance', () => {
//     expect(component).toBeTruthy();
//   });
// });
