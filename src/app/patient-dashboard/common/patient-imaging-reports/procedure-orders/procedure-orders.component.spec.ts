// import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

// import { ProcedureOrdersComponent } from './procedure-orders.component';
// import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { PatientDashboardCommonModule } from '../patient-dashboard.common.module';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CacheModule } from 'ionic-cache';
// import { ModalModule } from 'ngx-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
// import { ProcedureOrdersService } from './procedure-orders.service';
// import { UserService } from 'src/app/openmrs-api/user.service';
// import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
// import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
// import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
// import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
// import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
// import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { SecurePipe } from '../locator-map/secure.pipe';
// import { PatientService } from '../../services/patient.service';
// import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
// import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
// import { LocalStorageService } from 'src/app/utils/local-storage.service';
// import { PatientProgramService } from '../../programs/patient-programs.service';
// import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
// import { ProgramService } from '../../programs/program.service';
// import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
// import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
// import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
// import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
// import { SessionStorageService } from 'src/app/utils/session-storage.service';
// import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
// import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
// import { Observable, ReplaySubject } from 'rxjs';

// @Pipe({  name: 'proceduresFilter'})
// export class FakeTranslatePipe implements PipeTransform {
//   transform(value: any, decimalPlaces: number): any {
//     return value;
//   }
// }
// class MockProviderResourceService {
//   public v = 'full';

//   public getUrl(): string {
//     return 'provider';
//   }

//   public searchProvider(searchText: string, cached: boolean = false, v: string = null):
//     Observable<any> {
//     return Observable.of({});
//   }

//   public getProviderByUuid(uuid: string, cached: boolean = false, v: string = null):
//     Observable<any> {
//     return Observable.of({});
//   }
//   public getProviderByPersonUuid(uuid) {
//     const providerResults = new ReplaySubject(1);
//     return providerResults;
//   }
// }

// describe('ProcedureOrdersComponent', () => {
//   let component: ProcedureOrdersComponent;
//   let fixture: ComponentFixture<ProcedureOrdersComponent>;
//   let personResourceService: PersonResourceService;
//   const fakeRoutesProvider: RoutesProviderService = {
//     analyticsDashboardConfig: {},
//     clinicDashboardConfig: {},
//     patientListCohortConfig: {},
//     providerDashboardConfig: {},
//     patientDashboardConfig: {
//       'id': 'patientDashboard',
//       'name': 'Patient Dashboard',
//       'baseRoute': 'patient-dashboard',
//       'programs': [
//         {
//           'programName': 'General Info',
//           'programUuid': 'general-uuid',
//           'baseRoute': 'general',
//           'alias': 'general',
//           'published': true,
//           'requiresPatientEnrollment': false,
//           'routes': [
//             {
//               'url': 'patient-info',
//               'label': 'Patient Info',
//               'icon': 'fa fa-clipboard'
//             },
//             {
//               'url': 'visit',
//               'label': 'Visit',
//               'icon': 'icon-i-outpatient'
//             }
//           ]
//         },
//         {
//           'programName': 'HIV',
//           'programUuid': '781d85b0-1359-11df-a1f1-0026b9348838',
//           'baseRoute': 'hiv',
//           'alias': 'hiv',
//           'published': true,
//           'requiresPatientEnrollment': true,
//           'routes': [
//             {
//               'url': 'hiv-summary',
//               'label': 'HIV Summary',
//               'icon': 'fa fa-medkit'
//             },
//             {
//               'url': 'hiv-clinical-summary',
//               'label': 'HIV Clinical Summary',
//               'icon': 'fa fa-file-pdf-o'
//             }
//           ]
//         },
//         {
//           'programName': 'Oncology',
//           'programUuid': 'onc-uuid',
//           'baseRoute': 'oncology',
//           'alias': 'hiv',
//           'published': false,
//           'requiresPatientEnrollment': true,
//           'routes': [
//             {
//               'url': 'oncology-summary',
//               'label': 'Oncology Summary',
//               'icon': 'icon-i-oncology'
//             }
//           ]
//         }
//       ]
//     }
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ProcedureOrdersComponent,
//       FakeTranslatePipe,
//     SecurePipe ],
//       imports:
//       [
//         FormsModule,
//         HttpClientTestingModule,
//         CacheModule.forRoot(),
//         ModalModule.forRoot(),
//         ToastrModule.forRoot(),
//         NgxPaginationModule
//       ],
//     providers: [ProcedureOrdersService,
//       UserService,
//       PatientService,
//       PatientResourceService,
//       RoutesProviderService,
//       PatientProgramService,
//       ProgramWorkFlowResourceService,
//       ProgramWorkFlowStateResourceService,
//       ProgramEnrollmentResourceService,
//       ProgramService,
//       OrderResourceService,
//       ProcedureOrdersService,
//       LocalStorageService,
//       EncounterResourceService,
//       UserDefaultPropertiesService,
//       FileUploadResourceService,
//       AppSettingsService,
//       ConceptResourceService,
//       ProgramResourceService,
//       SessionStorageService,
//       {
//         provide: PersonResourceService, useFactory: () => {
//           return new MockProviderResourceService();
//         }
//       },
//       FakeTranslatePipe,
//       {
//         provide: ProviderResourceService, useFactory: () => {
//           return new MockProviderResourceService();
//         }
//       },
//       ObsResourceService, ],
//     schemas: [CUSTOM_ELEMENTS_SCHEMA,
//       NO_ERRORS_SCHEMA]
//     })
//     .compileComponents();
//     personResourceService = TestBed.get(PersonResourceService);
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ProcedureOrdersComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//    it('should get logged in user as the provider',
//     inject([ UserService, UserDefaultPropertiesService],
//       (userService: UserService,
//         userDefaultPropertiesService: UserDefaultPropertiesService) => {
//         // spy userDefaultPropertiesService
//         spyOn(userDefaultPropertiesService, 'getCurrentUserDefaultLocationObject')
//           .and.callFake((param) => {
//             return {
//               uuid: 'location-uuid',
//               display: 'location'
//             };
//           });

//         // spy userService
//         spyOn(userService, 'getLoggedInUser')
//           .and.callFake((param) => {
//             return {
//               personUuid: 'person-uuid',
//               display: 'person name'
//             };
//           });
//           component.ngOnInit();
//         expect(userDefaultPropertiesService.getCurrentUserDefaultLocationObject)
//           .toHaveBeenCalled();
//         // expect(userService.getLoggedInUser).toHaveBeenCalled();


//       })
//   );
// });
