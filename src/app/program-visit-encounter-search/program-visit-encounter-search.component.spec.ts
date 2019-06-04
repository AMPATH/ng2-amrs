

/* tslint:disable:no-unused-variable */
import { FormsModule } from '@angular/forms';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProgramVisitEncounterSearchComponent } from './program-visit-encounter-search.component';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytcis.mock';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { IonicStorageModule } from '@ionic/storage';
import { SelectDepartmentService } from './../shared/services/select-department.service';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';

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



const testParams = {
  'encounterType': ['f5381269-c889-4c5a-b384-d017441eedae'],
  'endDate': '2018-12-18',
  'programType': ['b731ba72-cf99-4176-9fcd-37cd186400c7'],
  'resetFilter': 'false',
  'startDate': '2018-12-18',
  'visitType': ['5033fbfc-ddc9-4f7f-853d-379659e48bdd']
};
const mockEmittedParams = {
  'programType': ['b731ba72-cf99-4176-9fcd-37cd186400c7'],
  'visitType': ['5033fbfc-ddc9-4f7f-853d-379659e48bdd'],
  'encounterType': ['f5381269-c889-4c5a-b384-d017441eedae'],
  'startDate': '2018-12-18',
  'endDate': '',
  'resetFilter': 'false'
};

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

const mockDepartmentPrograms = [
  {
    'uuid': 'b731ba72-cf99-4176-9fcd-37cd186400c7',
    'name': 'HTN AND DM CARE AT THE SECONDARY CARE LEVEL'
  },
  {
    'uuid': 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
    'name': 'HTN AND DM CARE AT THE TERTIARY CARE LEVEL PROGRAM'
  }
];
const mockPrograms = [
  {
    'id': 'b731ba72-cf99-4176-9fcd-37cd186400c7',
    'itemName': 'HTN AND DM CARE AT THE SECONDARY CARE LEVEL'
  },
  {
    'id': 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
    'itemName': 'HTN AND DM CARE AT THE TERTIARY CARE LEVEL PROGRAM'
  }
];

const mockProgramVisitsConfig = {
  'b731ba72-cf99-4176-9fcd-37cd186400c7': {
    'name': 'HTN-DM SECONDARY CARE',
    'visitTypes': [
      {
        'uuid': '5033fbfc-ddc9-4f7f-853d-379659e48bdd',
        'name': 'DM-HTN Secondary Visit',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
            'display': 'HTNDMINITIAL'
          }
        ]
      }
    ]
  },
  'bd9a8b06-73c7-44a8-928c-5e72247f4c1d': {
    'name': 'HTN-DM TERTIARY CARE',
    'visitTypes': [
      {
        'uuid': '67da2bee-70de-451c-8002-75429c71c46c',
        'name': 'DM-HTN Tertiary visit',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '14c3b999-2d5c-4c2e-b173-5212b9170652',
            'display': 'COEDMINITIAL'
          }
        ]
      }
    ]
  }
};



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


const departmentProgramSpyService = jasmine.createSpyObj('DepartmentProgramsConfigService', ['getDartmentProgramsConfig']);
const patientProgramSpyService = jasmine.createSpyObj('PatientProgramResourceService', ['getAllProgramVisitConfigs',
  'getPatientProgramVisitConfigs', 'getPatientProgramVisitTypes']);

const departmentProgramServiceSpy = departmentProgramSpyService.getDartmentProgramsConfig
  .and.returnValue(of(departmentConfig));

describe('Component: ProgramVisitEncounterSearch', () => {
  let fixture: ComponentFixture<ProgramVisitEncounterSearchComponent>;
  let comp: ProgramVisitEncounterSearchComponent;
  let localStorageService: LocalStorageService;
  let route: ActivatedRoute;
  let router: Router;
  let patientProgramService: PatientProgramResourceService;
  let departmentProgramService: DepartmentProgramsConfigService;

  beforeEach(async(() => {


    TestBed.configureTestingModule({
      imports:
        [
          AngularMultiSelectModule,
          FormsModule,
          DateTimePickerModule,
          IonicStorageModule.forRoot()
        ],
      declarations: [
        ProgramVisitEncounterSearchComponent
      ],
      providers: [
        PatientProgramResourceService,
        AppSettingsService,
        LocalStorageService,
        DepartmentProgramsConfigService,
        SelectDepartmentService,
        PatientService,
        Storage,
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: PatientProgramResourceService,
          useValue: departmentProgramSpyService
        },
        {
          provide: DepartmentProgramsConfigService,
          useValue: departmentProgramServiceSpy
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProgramVisitEncounterSearchComponent);
        comp = fixture.componentInstance;
        patientProgramService = fixture.debugElement.injector.get<PatientProgramResourceService>(PatientProgramResourceService);
        localStorageService = fixture.debugElement.injector.get<LocalStorageService>(LocalStorageService);
        departmentProgramService = fixture.debugElement.injector.get<DepartmentProgramsConfigService>(DepartmentProgramsConfigService);
        router = fixture.debugElement.injector.get(Router);
        route = fixture.debugElement.injector.get(ActivatedRoute);

      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(comp).toBeDefined();
  });

  it('should set the correct programs filter based on department selected', async () => {
    comp.programVisitsConfig = mockProgramVisitsConfig;
    comp.loadProgramFilter(mockDepartmentPrograms);
    expect(JSON.stringify(comp.programs)).toBe(JSON.stringify(mockPrograms));
  });

  it('should get correct  options from options map', async () => {
    const mockValues = ['142939b0-28a9-4649-baf9-a9d012bf3b3d'];
    const mockMap = new Map();
    mockMap.set('142939b0-28a9-4649-baf9-a9d012bf3b3d', {
      'id': '142939b0-28a9-4649-baf9-a9d012bf3b3d',
      'itemName': 'BREAST CANCER SCREENING PROGRAM'
    });
    const mockProgramArray = [{
      'id': '142939b0-28a9-4649-baf9-a9d012bf3b3d',
      'itemName': 'BREAST CANCER SCREENING PROGRAM'
    }];
    const filterArray = comp.loadFilterFromMap(mockValues, mockMap);
    expect(JSON.stringify(filterArray)).toBe(JSON.stringify(mockProgramArray));
  });

  it('should correctly identify params string value', async () => {
    const testString = 'uuid';
    const testArray = ['uuid'];
    const isString1 = comp.isString(testString);
    const isString2 = comp.isString(testArray);
    expect(isString1).toBe(true);
    expect(isString2).toBe(false);
  });

  it('should generate correct filter items from params object', () => {
    comp.visitMaps.set('5033fbfc-ddc9-4f7f-853d-379659e48bdd', {
      'id': '5033fbfc-ddc9-4f7f-853d-379659e48bdd',
      'itemName': 'DM-HTN Secondary Visit'
    });
    comp.programVisitMap.set('b731ba72-cf99-4176-9fcd-37cd186400c7', [
      {
        'uuid': '5033fbfc-ddc9-4f7f-853d-379659e48bdd',
        'name': 'DM-HTN Secondary Visit',
      }]);
    comp.visitTypeEncounterTypeMap.set('5033fbfc-ddc9-4f7f-853d-379659e48bdd', [

      {
        'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
        'display': 'CDMTRIAGE'
      },
      {
        'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
        'display': 'HTNDMINITIAL'
      }

    ]);
    comp.programMaps.set('b731ba72-cf99-4176-9fcd-37cd186400c7', {
      'id': 'b731ba72-cf99-4176-9fcd-37cd186400c7',
      'itemName': 'HTN AND DM CARE AT THE SECONDARY CARE LEVEL'
    });
    comp.encounterMaps.set('f5381269-c889-4c5a-b384-d017441eedae', {
      'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
      'display': 'CDMTRIAGE'
    });
    const programSelected = [{
      'id': 'b731ba72-cf99-4176-9fcd-37cd186400c7',
      'itemName': 'HTN AND DM CARE AT THE SECONDARY CARE LEVEL'
    }];
    const visitTypeSelected = [{
      'id': '5033fbfc-ddc9-4f7f-853d-379659e48bdd',
      'itemName': 'DM-HTN Secondary Visit'
    }];
    const encounterSelected = [{
      'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
      'display': 'CDMTRIAGE'
    }];
    spyOn(comp, 'emitParams');
    comp.getParamsFromUrl(testParams);
    expect(JSON.stringify(comp.program)).toBe(JSON.stringify(programSelected));
    expect(JSON.stringify(comp.visitType)).toBe(JSON.stringify(visitTypeSelected));
    expect(JSON.stringify(comp.encounterType)).toBe(JSON.stringify(encounterSelected));
    expect(comp.emitParams).toHaveBeenCalled();
    expect(comp.emitParams).toHaveBeenCalledWith(mockEmittedParams);

  });

});
