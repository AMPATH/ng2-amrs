import { DebugElement } from '@angular/core';

import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { BehaviorSubject, of } from 'rxjs';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientVitalsComponent } from './patient-vitals.component';
import { PatientVitalsService } from './patient-vitals.service';
import { PatientService } from '../../services/patient.service';
import { VitalsResourceService } from '../../../etl-api/vitals-resource.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import {
  ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import {
  ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ZscoreService } from 'src/app/shared/services/zscore.service';
import { SelectDepartmentService } from 'src/app/shared/services/select-department.service';
import { Patient } from '../../../models/patient.model';

const testVitals = [
  {
    bsa: null,
    diastolic_bp: null,
    ecog: null,
    encounter_datetime: '2019-07-10T11:08:50.000Z',
    encounter_id: 8863990,
    height: null,
    inr: 0,
    lcc: 26,
    location_id: 195,
    oxygen_sat: null,
    person_id: 913700,
    pulse: null,
    rcc: 25,
    systolic_bp: null,
    temp: null,
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763',
    weight: null
  },
  {
    BMI: '25.6',
    bmiForAge: null,
    bsa: null,
    diastolic_bp: 75,
    ecog: null,
    encounter_datetime: '2019-07-03T08:29:03.000Z',
    encounter_id: 8839806,
    height: 171,
    heightForAge: null,
    inr: 19,
    lcc: 30,
    location_id: 195,
    oxygen_sat: null,
    person_id: 913700,
    pulse: 92,
    rcc: 25,
    systolic_bp: 150,
    temp: 37,
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763',
    weight: 75,
    weightForHeight: -4
  },
  {
    BMI: '25.3',
    bmiForAge: null,
    bsa: null,
    diastolic_bp: 50,
    ecog: null,
    encounter_datetime: '2019-07-02T06:31:32.000Z',
    encounter_id: 8832764,
    height: 170,
    heightForAge: null,
    inr: 2,
    lcc: 28,
    location_id: 195,
    oxygen_sat: null,
    person_id: 913700,
    pulse: 55,
    rcc: 27,
    systolic_bp: 123,
    temp: 30,
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763',
    weight: 73,
    weightForHeight: -4
  },
  {
    bsa: null,
    diastolic_bp: null,
    ecog: null,
    encounter_datetime: '2019-05-02T17:27:32.000Z',
    encounter_id: 8642190,
    height: null,
    inr: null,
    lcc: null,
    location_id: 204,
    oxygen_sat: null,
    person_id: 913700,
    pulse: null,
    rcc: null,
    systolic_bp: null,
    temp: null,
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763',
    weight: null
  }
];

const testPatient1 = new Patient({
  allIdentifiers: '297400783-9',
  commonIdentifiers: {
    ampathMrsUId: '297400783-9',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '297400783-9 - Test Anticoagulation Treatment',
  encounters: [
    {
      encounterDatetime: new Date(),
      encounterType: {
        display: 'ANTICOAGULATION TRIAGE',
        uuid: '6accd920-6254-4063-bfd1-0e1b70b3f201'
      },
      form: {
        name: 'ONCOLOGY POC Anticoagulation Triage Form',
        uuid: '84539fd3-842c-46a7-a595-fc64919badd6'
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      },
      patient: {
        uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763'
      }
    }
  ],
  person: {
    age: 30,
    dead: false,
    deathDate: null,
    display: 'Test Anticoagulation Treatment',
    gender: 'F',
    healthCenter: '',
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763'
  }
});

const patientVitalsServiceStub = {
  getVitals: (patient, startIndex, limit) => {
    return of(testVitals);
  }
};

const selectDepartmentServiceStub = {
  getUserSetDepartment: () => {
    return 'HEMATO-ONCOLOGY';
  }
};

class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

describe('Component: Vitals Unit Tests', () => {
  let component: PatientVitalsComponent;
  let fixture: ComponentFixture<PatientVitalsComponent>;
  let localStorageService: LocalStorageService;
  let patientService: PatientService;
  let patientVitalsService: PatientVitalsService;
  let selectDepartmentService: SelectDepartmentService;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ PatientVitalsComponent ],
      providers: [
        AppSettingsService,
        EncounterResourceService,
        FakeAppFeatureAnalytics,
        LocalStorageService,
        RoutesProviderService,
        PatientResourceService,
        PatientProgramService,
        ProgramEnrollmentResourceService,
        ProgramResourceService,
        ProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        VitalsResourceService,
        ZscoreService,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(testPatient1)
        },
        {
          provide: PatientVitalsService,
          useValue: patientVitalsServiceStub
        },
        {
          provide: SelectDepartmentService,
          useValue: selectDepartmentServiceStub,
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVitalsComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.get(LocalStorageService);
    patientVitalsService = TestBed.get(PatientVitalsService);
    patientService = TestBed.get(PatientService);
    selectDepartmentService = TestBed.get(SelectDepartmentService);
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have all of its methods defined', () => {
    expect(component.getPatient).toBeDefined();
    expect(component.loadVitals).toBeDefined();
    expect(component.loadMoreVitals).toBeDefined();
    expect(component.getUserDefaultDepartment).toBeDefined();
    expect(component.interpretEcogValuesForOncology).toBeDefined();
  });

  it('should have required properties', (done) => {
    expect(component.vitals.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.dataLoaded).toBe(false);
    expect(component.loadingVitals).toBe(false);
    expect(component.errors.length).toBe(0);
    expect(component.isDepartmentOncology).toBe(false);
    done();
  });

  it('should show patient vitals after the component initializes', async(() => {
    expect(component.vitals.length).toEqual(0, 'No vitals yet');
    fixture.detectChanges();
    const vitalsLabels = nativeElement.querySelectorAll('.labels');
    const vitalsList = <HTMLElement>nativeElement.querySelector('.vitals');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isLoading).toBeFalsy();
      expect(component.loadingVitals).toBeFalsy();
      expect(component.nextStartIndex).toEqual(4);
      expect(vitalsLabels[0].children.length).toEqual(14, 'Fourteen vitals');
      expect((<HTMLElement>vitalsLabels[0].children[1]).innerText).toEqual('Date');
      expect((<HTMLElement>vitalsLabels[0].children[2]).innerText).toEqual('BP');
      expect((<HTMLElement>vitalsLabels[0].children[3]).innerText).toEqual('Pulse');
      expect((<HTMLElement>vitalsLabels[0].children[4]).innerText).toEqual('Temperature');
      expect((<HTMLElement>vitalsLabels[0].children[5]).innerText).toEqual('Oxygen Sat');
      expect((<HTMLElement>vitalsLabels[0].children[6]).innerText).toEqual('Height');
      expect((<HTMLElement>vitalsLabels[0].children[7]).innerText).toEqual('Weight');
      // Show BMI if patient is older than 18 years old
      expect((<HTMLElement>vitalsLabels[0].children[8]).innerText).toEqual('BMI');
      expect((<HTMLElement>vitalsLabels[0].children[9]).innerText).toEqual('BSA');
      // Show ECOG, INR, LCC and RCC for Hemato-Oncology patients with these values
      expect((<HTMLElement>vitalsLabels[0].children[10]).innerText).toEqual('ECOG');
      expect((<HTMLElement>vitalsLabels[0].children[11]).innerText).toEqual('INR');
      expect((<HTMLElement>vitalsLabels[0].children[12]).innerText).toEqual('LCC');
      expect((<HTMLElement>vitalsLabels[0].children[13]).innerText).toEqual('RCC');
      expect((<HTMLElement>vitalsList.children[1]).innerText).toEqual('03-07-2019');
      expect((<HTMLElement>vitalsList.children[2]).innerText).toEqual('150/75');
      const systolic_bp = <HTMLElement>nativeElement.querySelector('.systolic_bp');
      expect(systolic_bp).toBeTruthy();
      expect(systolic_bp.innerText).toEqual('150/');
      expect(systolic_bp.style.cssText).toEqual('color: red;', 'Abnormal systolic value (>= 140)');
      const diastolic_bp = <HTMLElement>nativeElement.querySelector('.diastolic_bp');
      expect(diastolic_bp).toBeTruthy();
      expect(diastolic_bp.innerText).toEqual('75', 'Normal diastolic value');
      expect((<HTMLElement>vitalsList.children[3]).innerText).toEqual('92', 'Pulse');
      const pulse = <HTMLElement>nativeElement.querySelector('.pulse');
      expect(pulse.style.cssText).not.toContain('color: red;', 'Normal pulse value');
      expect((<HTMLElement>vitalsList.children[4]).innerText).toEqual('37', 'Temperature');
      const temp = <HTMLElement>nativeElement.querySelector('.temp');
      expect(temp.style.cssText).not.toContain('color: red;', 'Normal temperature value');
      expect((<HTMLElement>vitalsList.children[5]).innerText).toMatch(/\s*/, 'No oxygen sat value');
      expect((<HTMLElement>vitalsList.children[6]).innerText).toEqual('171', 'Height');
      expect((<HTMLElement>vitalsList.children[7]).innerText).toEqual('75', 'Weight');
      expect((<HTMLElement>vitalsList.children[8]).innerText).toEqual('25.6', 'BMI');
      expect((<HTMLElement>vitalsList.children[9]).innerText).toMatch(/\s*/, 'No BSA value');
      expect((<HTMLElement>vitalsList.children[10]).innerText).toMatch(/\s*/, 'No ECOG value');
      expect((<HTMLElement>vitalsList.children[11]).innerText).toEqual('19', 'INR');
      expect((<HTMLElement>vitalsList.children[12]).innerText).toEqual('30', 'LCC');
      expect((<HTMLElement>vitalsList.children[13]).innerText).toEqual('25', 'RCC');
    });
  }));
});
