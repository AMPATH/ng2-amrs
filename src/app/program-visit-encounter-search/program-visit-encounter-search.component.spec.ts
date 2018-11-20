

/* tslint:disable:no-unused-variable */
import { ChangeDetectorRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProgramVisitEncounterSearchComponent } from './program-visit-encounter-search.component';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytcis.mock';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatientProgramResourceService } from '../etl-api/patient-program-resource.service';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentProgramsConfigService } from '../etl-api/department-programs-config.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { SelectDepartmentService } from './program-visit-encounter-search.service';

import { PatientService } from '../patient-dashboard/services/patient.service';
import { delay } from 'rxjs/operators';

class MockRouter {
 public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
 public params = of([{ 'id': 1 }]);
 public snapshot = {
    queryParams: { date: '' }
  };
}

const mockDepartmentsFilter = [
   {
     'itemName': 'CDM',
     'id': 'uud1'
   },
   {
     'itemName': 'OVC',
     'id': 'uud2'
   },
   {
     'itemName': 'BSG',
     'id': 'uud3'
   }
];

const departmentConfig = {
  'uud1': {
    'name': 'CDM',
    'programs': [
      {
        'uuid': 'fc15ac01-5381-4854-bf5e-917c907aa77f',
        'name': 'CDM PROGRAM'
      }

    ]
  },
  'uud2': {
    'name': 'OVC',
    'programs': [
      {
        'uuid': '781d8768-1359-11df-a1f1-0026b9348838',
        'name': 'OVC PROGRAM'
      }

    ]
  },
  'uud3': {
    'name': 'BSG',
    'programs': [
      {
        'uuid': '781d8a88-1359-11df-a1f1-0026b9348838',
        'name': 'BSG PROGRAM'
      }

    ]
  }

};

const departmentSelected = [{
  'itemName': 'CDM',
  'id': 'uud1'
}];
const mockProgramVisitsConfig = {

  'fc15ac01-5381-4854-bf5e-917c907aa77f': {
    'name': 'CDM PROGRAM',
    'dataDependencies': ['patient', 'enrollment', 'hivLastTenClinicalEncounters'],
    'incompatibleWith': [],
    'visitTypes': [{
      'uuid': '8072afd0-0cd9-409e-914d-1833e83943f7',
      'name': 'CDM Visit',
      'encounterTypes': []
    }]
  }

};

const programsSelected = [
  {
     'id': 'fc15ac01-5381-4854-bf5e-917c907aa77f',
     'itemName': 'CDM PROGRAM'
  }];

const visitType = [{
   'id': '1',
   'itemName': 'visitType1'
}];

const visitTypes = [
  {
    'id': '1',
    'itemName': 'visitType1'
  },
  {
    'id': '2',
    'itemName': 'visitType2'
  }

];

export class FakePatientProgramResourceService {

  constructor() {}

  getAllProgramVisitConfigs() {
    return of(mockProgramVisitsConfig).pipe(delay(50));
  }

  getPatientProgramVisitConfigs(uuid) {
    return of(mockProgramVisitsConfig).pipe(delay(50));
  }

  getPatientProgramVisitTypes(patient: string, program: string,
                              enrollment: string, location: string) {
    return of(visitTypes);
  }
}

export class FakeDepartmentProgramsConfigService {

  constructor() {}

  getDartmentProgramsConfig() {
    return of(departmentConfig).pipe(delay(50));
  }
}

// describe('Component: ProgramVisitEncounterSearch', () => {
//   let fixture: ComponentFixture<ProgramVisitEncounterSearchComponent>;
//   let comp: ProgramVisitEncounterSearchComponent;
//   let patientProgramService: PatientProgramResourceService;
//   let localStorageService: LocalStorageService;
//   let departmentProgramService: DepartmentProgramsConfigService;
//   let dataCacheService: DataCacheService;
//   let cacheService: CacheService;
//   let route: ActivatedRoute;
//   let router: Router;
//   let cd: ChangeDetectorRef;
//   let storage: Storage;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports:
//       [
//        AngularMultiSelectModule,
//        FormsModule,
//        IonicStorageModule.forRoot()
//       ],
//       declarations: [
//           ProgramVisitEncounterSearchComponent
//       ],
//       providers: [
//         PatientProgramResourceService,
//         AppSettingsService,
//         LocalStorageService,
//         DepartmentProgramsConfigService,
//         DataCacheService,
//         SelectDepartmentService,
//         CacheService,
//         PatientService,
//         Storage,
//         {
//           provide: Http,
//           useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backendInstance, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions]
//         },
//         { provide: Router, useClass: MockRouter },
//         {
//           provide: ActivatedRoute,
//           useClass: MockActivatedRoute
//         },
//         {
//           provide: AppFeatureAnalytics,
//           useClass: FakeAppFeatureAnalytics
//         },
//         {
//           provide: PatientProgramResourceService,
//           useFactory: () => {new FakePatientProgramResourceService() }
//         },
//         {
//           provide: DepartmentProgramsConfigService,
//           useFactory: () => { new FakeDepartmentProgramsConfigService() }
//         },
//         MockBackend,
//         BaseRequestOptions
//       ]
//     }).compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(ProgramVisitEncounterSearchComponent);
//         comp = fixture.componentInstance;
//         patientProgramService = fixture.debugElement.injector.get(PatientProgramResourceService);
//         localStorageService = fixture.debugElement.injector.get(LocalStorageService);
//         departmentProgramService = fixture.debugElement.injector
//         .get(DepartmentProgramsConfigService);
//         cd = fixture.debugElement.injector.get(ChangeDetectorRef);
//         router = fixture.debugElement.injector.get(Router);
//         route = fixture.debugElement.injector.get(ActivatedRoute);

//       });
//   }));

//   afterAll(() => {
//     TestBed.resetTestingModule();
//   });

//   it('should create an instance', () => {
//       expect(comp).toBeDefined();
//   });
//   it('should load departments from departments config', () => {
//     comp.programDepartments = departmentConfig;
//     comp.getAllDepartments();
//     let departments = comp.departments;

//     expect(departments).toEqual(mockDepartmentsFilter);
//   });

//   it('should load programs on selecting departments config', () => {

//     comp.department = departmentSelected;
//     comp.departments = mockDepartmentsFilter;
//     comp.programDepartments = departmentConfig;
//     comp.programVisitsEncounters = JSON.parse(JSON.stringify(mockProgramVisitsConfig));
//     comp.selectDepartment(departmentSelected);
//     let programs = JSON.stringify(comp.programs);

//     expect(programs).toEqual(JSON.stringify(programsSelected));
//   });

// });
