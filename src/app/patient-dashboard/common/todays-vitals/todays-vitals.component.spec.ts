import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BehaviorSubject, of } from 'rxjs';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { FakeVisitResourceService } from '../../../openmrs-api/fake-visit-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { PatientService } from '../../services/patient.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import {
  ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import {
  ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { TodaysVitalsComponent } from './todays-vitals.component';
import { TodaysVitalsService } from './todays-vitals.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { VitalsDatasource } from './vitals.datasource';
import { Patient } from '../../../models/patient.model';
import { testVitals1, testVitals2, testPatient1, testPatient2 } from './todays-vitals.mock';

class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

const todaysVitalsServiceStub = {
  getTodaysVitals: () => {
    return new Promise((resolve, reject) => resolve(testVitals1));
  }
};


const encounterResourceServiceStub = {
  getEncounterByUuid: () => of(testPatient1.encounters[0])
};

describe('Component: TodaysVitalsComponent', () => {
  let component: TodaysVitalsComponent;
  let fixture: ComponentFixture<TodaysVitalsComponent>;
  let patientService: PatientService;
  let vitalsService: TodaysVitalsService;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ TodaysVitalsComponent ],
      providers: [
        AppSettingsService,
        FakeAppFeatureAnalytics,
        LocalStorageService,
        PatientProgramService,
        PatientResourceService,
        ProgramEnrollmentResourceService,
        ProgramResourceService,
        ProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        RoutesProviderService,
        VitalsDatasource,
        {
          provide: EncounterResourceService,
          useValue: encounterResourceServiceStub
        },
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(testPatient1)
        },
        {
          provide: TodaysVitalsService,
          useValue: todaysVitalsServiceStub
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: VisitResourceService,
          useClass: FakeVisitResourceService
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysVitalsComponent);
    component = fixture.componentInstance;
    patientService = TestBed.get(PatientService);
    vitalsService = TestBed.get(TodaysVitalsService);
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have all its methods defined', () => {
    expect(component.toggleMore).toBeDefined();
    expect(component.getTodaysVitals).toBeDefined();
    expect(component.getTodaysEncounters).toBeDefined();
    expect(component.getTodaysEncounterDetails).toBeDefined();
    expect(component.subscribeToPatientChangeEvent).toBeDefined();
    expect(component.resetVariables).toBeDefined();
  });

  it('should display today\'s vitals after the component initializes', async(() => {
    fixture.detectChanges();
    expect(component.todaysVitals).not.toBeDefined('No vitals');
    const vitalsList = <HTMLElement>nativeElement.querySelector('li.list-group-item');
    expect(vitalsList.innerHTML).toMatch(/No vitals taken for the patient today/);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.todaysVitals).toBeDefined();
      expect(component.todaysVitals.length).toEqual(6, 'Six vitals');
      const vitalLabels = nativeElement.querySelectorAll('.text-primary');
      expect(vitalLabels[0].innerHTML).toMatch(/BP: /);
      expect(vitalLabels[1].innerHTML).toMatch(/Pulse: /);
      expect(vitalLabels[2].innerHTML).toMatch(/Temperature: /);
      expect(vitalLabels[3].innerHTML).toMatch(/Height: /);
      expect(vitalLabels[4].innerHTML).toMatch(/Weight: /);
      expect(vitalLabels[5].innerHTML).toMatch(/BMI \(Kg\/M2\)/);
      const vitalValues = nativeElement.querySelectorAll('.value');
      expect(vitalValues[0].innerHTML).toMatch(/123/, 'Blood pressure: Systolic');
      const compoundVitalValue = <HTMLElement>nativeElement.querySelector('.compoundValue');
      expect(compoundVitalValue.innerHTML).toMatch(/50/, 'Blood pressure: Diastolic');
      expect(vitalValues[1].innerHTML).toMatch(/55/);
      expect(vitalValues[2].innerHTML).toMatch(/30/);
      expect(vitalValues[3].innerHTML).toMatch(/170/);
      expect(vitalValues[4].innerHTML).toMatch(/73/);
      expect(vitalValues[5].innerHTML).toMatch(/25.3/);
    });
  }));

  it('should display a different set of vitals specific to the patient when a new patient is loaded',
    async(() => {
      // load a different patient
      patientService.currentlyLoadedPatient.next(testPatient2);
      spyOn(vitalsService, 'getTodaysVitals').and.returnValue(
        new Promise((resolve, reject) => resolve(testVitals2)));
      fixture.detectChanges();
      expect(component.todaysVitals).not.toBeDefined('No vitals');
      const vitalsList = <HTMLElement>nativeElement.querySelector('li.list-group-item');
      expect(vitalsList.innerHTML).toMatch(/No vitals taken for the patient today/);

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.todaysVitals).toBeDefined();
        expect(component.todaysVitals.length).toEqual(8, '8 Vitals');
        const vitalLabels = nativeElement.querySelectorAll('.text-primary');
        expect(vitalLabels[0].innerHTML).toMatch(/BP: /);
        expect(vitalLabels[1].innerHTML).toMatch(/Pulse: /);
        expect(vitalLabels[2].innerHTML).toMatch(/Oxygen Saturation: /);
        expect(vitalLabels[3].innerHTML).toMatch(/Temperature: /);
        expect(vitalLabels[4].innerHTML).toMatch(/Height: /);
        expect(vitalLabels[5].innerHTML).toMatch(/Weight:/);
        expect(vitalLabels[6].innerHTML).toContain('BMI For Age:');
        const vitalValues = nativeElement.querySelectorAll('.value');
        expect(vitalValues[0].innerHTML).toMatch(/120/, 'Blood pressure: Systolic');
        const compoundVitalValue = <HTMLElement>nativeElement.querySelector('.compoundValue');
        expect(compoundVitalValue.innerHTML).toMatch(/60/, 'Blood pressure: Diastolic');
        expect(vitalValues[1].innerHTML).toMatch(/41/);
        expect(vitalValues[2].innerHTML).toMatch(/5/);
        expect(vitalValues[3].innerHTML).toMatch(/35/);
        expect(vitalValues[4].innerHTML).toMatch(/173/);
        expect(vitalValues[5].innerHTML).toMatch(/76/);
        expect(vitalValues[6].innerHTML).toMatch(/1/);
      });
    }
  ));

  it('should display an error if fetching the current day\'s vitals fails', async(() => {
    spyOn(vitalsService, 'getTodaysVitals').and.returnValue(
      new Promise((resolve, reject) => reject(new Error('Could not get vitals'))));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorDiv = <HTMLElement>nativeElement.querySelector('div.alert.alert-danger.alert-dismissible');
      expect(errorDiv.innerHTML).toContain('Error fetching today\'s vitals');
      const errorButton = <HTMLButtonElement>nativeElement.querySelector('button.close');
      expect(errorButton.innerHTML).toContain('×', 'Dismiss error');
    });
  }));

  it('should fetch and return the current day\'s encounters', () => {
    const todaysEncounters = component.getTodaysEncounters(testPatient1.encounters);
    expect(todaysEncounters.length).toBeGreaterThan(0);
    expect(todaysEncounters[0].encounterType.display).toEqual('ANTICOAGULATION TRIAGE');
    expect(todaysEncounters[0].encounterType.uuid).toEqual('6accd920-6254-4063-bfd1-0e1b70b3f201');
    expect(todaysEncounters[0].form.name).toEqual('ONCOLOGY POC Anticoagulation Triage Form');
    expect(todaysEncounters[0].form.uuid).toEqual('84539fd3-842c-46a7-a595-fc64919badd6');
    expect(todaysEncounters[0].location.display).toEqual('Location Test');
    expect(todaysEncounters[0].location.uuid).toEqual('18c343eb-b353-462a-9139-b16606e6b6c2');
    expect(todaysEncounters[0].patient.uuid).toEqual('7ce98cb8-9785-4467-91cc-64afa2d59763');
  });

  it('should fetch and return the details of the currrent day\'s encounter', () => {
    const todaysEncounterDetails = component.getTodaysEncounterDetails(testPatient1);
    todaysEncounterDetails.then(encounterDetails => {
      expect(encounterDetails[0].encounterType.display).toEqual('ANTICOAGULATION TRIAGE');
      expect(encounterDetails[0].encounterType.uuid).toEqual('6accd920-6254-4063-bfd1-0e1b70b3f201');
      expect(encounterDetails[0].form.name).toEqual('ONCOLOGY POC Anticoagulation Triage Form');
      expect(encounterDetails[0].form.uuid).toEqual('84539fd3-842c-46a7-a595-fc64919badd6');
      expect(encounterDetails[0].location.display).toEqual('Location Test');
      expect(encounterDetails[0].location.uuid).toEqual('18c343eb-b353-462a-9139-b16606e6b6c2');
      expect(encounterDetails[0].patient.uuid).toEqual('7ce98cb8-9785-4467-91cc-64afa2d59763');
    }, err => {
      fail('Expected encounter details, not an error');
    });
  });
});
