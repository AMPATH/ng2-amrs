import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { convertToParamMap, Router, Params, ParamMap, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BehaviorSubject, ReplaySubject, of } from 'rxjs';

import { AppSettingsService } from '../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { EnrollmentShortcutComponent } from './enrollment-shortcut.component';
import { DepartmentProgramsConfigService } from 'src/app/etl-api/department-programs-config.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { PatientProgramService } from '../../patient-dashboard/programs/patient-programs.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { PatientService } from '../../patient-dashboard/services/patient.service';
import { ProgramEnrollmentResourceService } from '../../openmrs-api/program-enrollment-resource.service';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { ProgramWorkFlowStateResourceService } from '../../openmrs-api/program-workflow-state-resource.service';
import { ProgramWorkFlowResourceService } from '../../openmrs-api/program-workflow-resource.service';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { Patient } from 'src/app/models/patient.model';

class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}

class FakeCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}

class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

const testDeptProgramsConfig = {
  uud1: {
    name: 'HIV',
    programs: [
      {'uuid': '781d85b0-1359-11df-a1f1-0026b9348838', 'name': 'STANDARD HIV TREATMENT'},
      {'uuid': 'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31', 'name': 'RESISTANCE CLINIC PROGRAM'},
      {'uuid': '781d897a-1359-11df-a1f1-0026b9348838', 'name': 'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV'},
      {'uuid': '96047aaf-7ab3-45e9-be6a-b61810fe617d', 'name': 'PEP PROGRAM'},
      {'uuid': 'c19aec66-1a40-4588-9b03-b6be55a8dd1d', 'name': 'PrEP PROGRAM'},
      {'uuid': '334c9e98-173f-4454-a8ce-f80b20b7fdf0', 'name': 'HIV DIFFERENTIATED CARE PROGRAM'},
      {'uuid': '96ba279b-b23b-4e78-aba9-dcbd46a96b7b', 'name': 'HIV TRANSIT PROGRAM'},
      {'uuid': '781d8880-1359-11df-a1f1-0026b9348838', 'name': 'EXPRESS CARE PROGRAM'},
      {'uuid': 'c6bf3625-de80-4a88-a913-38273e300a55', 'name': 'HIV RETENTION PROGRAM'},
      {'uuid': '4480c782-ef05-4d88-b2f8-c892c99438f6', 'name': 'ACTG PROGRAM'},
      {'uuid': 'c4246ff0-b081-460c-bcc5-b0678012659e', 'name': 'VIREMIA PROGRAM'},
      {'uuid': '781d8768-1359-11df-a1f1-0026b9348838', 'name': 'OVC PROGRAM'},
      {'uuid': '6ff0a6dc-ef8f-467a-86fc-9d9b263d8761', 'name': 'DTG PHARMACO-VIGILANCE'},
      {'uuid': 'a8e7c30d-6d2f-401c-bb52-d4433689a36b', 'name': 'HEI PROGRAM'},
      {'uuid': 'a685c057-d475-42ef-bb33-8b0c1d73b122', 'name': 'HIV SOCIAL WORK PROGRAM'},
      {'uuid': '03552f68-8233-4793-8353-3db1847bb617', 'name': 'NUTRITION PROGRAM'}
    ]
  },
  uud2: {
    name: 'HEMATO-ONCOLOGY',
    programs: [
      {'uuid': '142939b0-28a9-4649-baf9-a9d012bf3b3d', 'name': 'BREAST CANCER SCREENING PROGRAM'},
      {'uuid': 'cad71628-692c-4d8f-8dac-b2e20bece27f', 'name': 'CERVICAL CANCER SCREENING PROGRAM'},
      {'uuid': '43b42170-b3ce-4e03-9390-6bd78384ac06', 'name': 'GYN-ONCOLOGY TREATMENT PROGRAM'},
      {'uuid': '88566621-828f-4569-9af5-c54f8237750a', 'name': 'BREAST CANCER TREATMENT PROGRAM'},
      {'uuid': 'e48b266e-4d80-41f8-a56a-a8ce5449ebc6', 'name': 'SICKLE CELL PROGRAM'},
      {'uuid': '698b7153-bff3-4931-9638-d279ca47b32e', 'name': 'MULTIPLE MYELOMA PROGRAM'},
      {'uuid': 'a3610ba4-9811-46b3-9628-83ec9310be13', 'name': 'HEMOPHILIA PROGRAM'},
      {'uuid': '725b5193-3452-43fc-aca3-6a80432d9bfa', 'name': 'GENERAL ONCOLOGY PROGRAM'},
      {'uuid': 'e8bc5036-1462-44fa-bcfe-ced21eae2790', 'name': 'LUNG CANCER TREATMENT PROGRAM'},
      {'uuid': '418fe011-a903-4862-93d4-5e7c84d9c253', 'name': 'ANTICOAGULATION TREATMENT PROGRAM'}
    ]
  }
};

const departmentProgramsConfigServiceStub = {
  getDartmentProgramsConfig: () => of(testDeptProgramsConfig)
};

const testPatient = new Patient({
  allIdentifiers: '749138740-8',
  commonIdentifiers: {
    ampathMrsUId: '749138740-8',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '749138740-8 - Test Male Treatment',
  openmrsModel: {
    display: '749138740-8 - Test Male Treatment',
    person: {
      age: 35,
      display: 'Test Male Enrollment',
      gender: 'M'
    }
  },
  enrolledPrograms: [
    {
      baseRoute: '',
      buttons: {
        landing: {
          display: 'Go to Program',
          url: null
        },
        visit: {
          display: 'Program Visit',
          url: null
        }
      },
      concept: {
        display: 'LYMPHOMA TREATMENT PROGRAM',
        uuid: '97a494b6-d13a-450a-b3ec-63cf28579428'
      },
      dateCompleted: null,
      dateEnrolled: '2019-07-10',
      dateEnrolledView: '10-07-2019',
      enrolledPrograms: {
        dateCompleted: null,
        dateEnrolled: 'Jul 10, 2019',
        display: 'Lymphoma Treatment Program',
        location: {
          address1: 'Eldoret',
          country: 'Kenya',
          name: 'Location Test',
          uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
        },
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-07-10T00:00:00.000+0300',
          display: 'LYMPHOMA TREATMENT PROGRAM',
          program: {
            uuid: '40677054-c402-4c56-a0e4-5dd7d799b52f'
          },
          states: [],
          uuid: '393e443c-b7c4-4a63-9c19-be42b97e7ed1',
          voided: false
        },
        programUuid: '40677054-c402-4c56-a0e4-5dd7d799b52f',
        states: [],
        uuid: '393e443c-b7c4-4a63-9c19-be42b97e7ed1',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      program: {
        concept: {
          display: 'LYMPHOMA TREATMENT PROGRAM',
          uuid: '97a494b6-d13a-450a-b3ec-63cf28579428'
        },
        description: undefined,
        display: 'LYMPHOMA TREATMENT PROGRAM',
        name: undefined,
        uuid: '40677054-c402-4c56-a0e4-5dd7d799b52f',
      },
      programUuid: '40677054-c402-4c56-a0e4-5dd7d799b52f',
      referral_completed: false,
      validationError: ''
    }
  ],
  person: {
    age: 35,
    display: 'Test Male Enrollment',
    gender: 'M',
    healthCenter: 'Tambach'
  },
  uuid: '767ba950-4822-4883-8f96-7be6c14ebbe0'
});

let localStorageService;

describe('Component', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  // tslint:disable-next-line: prefer-const
  let activatedRoute: ActivatedRouteStub;
  let component: EnrollmentShortcutComponent;
  let fixture: ComponentFixture<EnrollmentShortcutComponent>;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;

  localStorageService = jasmine.createSpyObj('LocalStorageService',
    ['getItem', 'getObject', 'setObject', 'setItem']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        EnrollmentShortcutComponent,
      ],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        EncounterResourceService,
        PatientProgramService,
        PatientResourceService,
        ProgramEnrollmentResourceService,
        ProgramResourceService,
        ProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        RoutesProviderService,
        {
          provide: ActivatedRoute,
          useValue: activatedRoute
        },
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        {
          provide: DepartmentProgramsConfigService,
          useValue: departmentProgramsConfigServiceStub
        },
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(testPatient)
        },
        {
          provide: LocalStorageService,
          useValue: localStorageService
        },
        {
          provide: Router,
          useValue: routerSpy
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentShortcutComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    nativeEl = debugEl.nativeElement;

    localStorageService.getItem.and.returnValue(JSON.stringify([
      { 'itemName': 'HEMATO-ONCOLOGY', 'id': 'uud2' }
    ]));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all of its methods defined' , () => {
    expect(component.subscribeToPatientChanges).toBeDefined();
    expect(component.determineProgramsPatientEnrolledIn).toBeDefined();
    expect(component.determineUserDefaultDepartment).toBeDefined();
    expect(component.fetchAllProgramsAndDepartments).toBeDefined();
    expect(component.filterProgramsByDefaultDepartment).toBeDefined();
    expect(component.determinePossibleProgramsForPatient).toBeDefined();
    expect(component.filterOutIncompatiblePrograms).toBeDefined();
    expect(component.triggerEnrollment).toBeDefined();
  });

  it('should fetch and display all the compatible programs the patient can enroll in after the component initializes', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeTruthy();
    // Currently loaded patient
    expect(component.patient.display).toEqual('749138740-8 - Test Male Treatment');
    expect(component.patientEnrolledPrograms.length).toEqual(1, 'One enrollment');
    expect(component.patientEnrolledPrograms).toEqual(testPatient.enrolledPrograms);
    expect(component.allDepartmentsProgramsConf.length).toEqual(2,
      'HEMATO-ONCOLOGY and HIV program configs');
    expect(component.allProgramsInDefaultDepartmentConf.length).toEqual(10, '10 programs');
    // Gender incompatible programs removed
    expect(component.patientEnrollablePrograms).not.toContain('CERVICAL CANCER SCREENING PROGRAM');
    expect(component.patientEnrollablePrograms).not.toContain('GYN-ONCOLOGY TREATMENT PROGRAM');
    expect(component.patientEnrollablePrograms.length).toEqual(8,
      'Cervical Cancer Screening & Gyn-Oncology Treatment programs removed for male patient');
    const programsList = nativeEl.querySelectorAll('li');
    const programSelectBtn = <HTMLButtonElement>nativeEl.querySelector('.btn.btn-primary.btn-sm.dropdown-toggle');
    expect(programSelectBtn.innerHTML).toMatch(/Select Program to Enroll/);
    expect(programsList[0].innerText).toEqual('BREAST CANCER SCREENING PROGRAM');
    expect(programsList[1].innerText).toEqual('BREAST CANCER TREATMENT PROGRAM');
    expect(programsList[2].innerText).toEqual('SICKLE CELL PROGRAM');
    expect(programsList[3].innerText).toEqual('MULTIPLE MYELOMA PROGRAM');
    expect(programsList[4].innerText).toEqual('HEMOPHILIA PROGRAM');
    expect(programsList[5].innerText).toEqual('GENERAL ONCOLOGY PROGRAM');
    expect(programsList[6].innerText).toEqual('LUNG CANCER TREATMENT PROGRAM');
    expect(programsList[7].innerText).toEqual('ANTICOAGULATION TREATMENT PROGRAM');
  });

  it('should enroll the patient into a program when the program name is clicked on: ', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const programsList = nativeEl.querySelectorAll('li');
    const programSelectBtn = <HTMLButtonElement>nativeEl.querySelector('.btn.btn-primary.btn-sm.dropdown-toggle');
    // Enroll into General Oncology Program
    const programToEnrollIn = <HTMLElement>programsList[5];
    click(<HTMLElement>programToEnrollIn.firstElementChild);

    const enrollmentUrl = [
      'patient-dashboard',
      'patient',
      `${testPatient.uuid}`,
      'general',
      'general',
      'program-manager',
      'new-program',
      'step',
      3
    ];

    const queryParams = {
      program: testDeptProgramsConfig.uud2.programs[7].uuid // General Oncology Program
    };

    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(enrollmentUrl,
      { queryParams: queryParams }
    );
  });
});

function newEvent(eventName: string, bubbles = false, cancelable = false) {
  const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
