import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { Patient } from '../../../models/patient.model';
import { PatientInfoComponent } from './patient-info.component';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';

const mockPatient = new Patient({
  allIdentifiers: '297400783-9',
  commonIdentifiers: {
    ampathMrsUId: '297400783-9',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: '',
  },
  display: '297400783-9 - Test Anticoagulation Treatment',
  encounters: [
    {
      encounterDatetime: new Date(),
      encounterType: {
        display: 'ANTICOAGULATION TRIAGE',
        uuid: '6accd920-6254-4063-bfd1-0e1b70b3f201',
      },
      form: {
        name: 'ONCOLOGY POC Anticoagulation Triage Form',
        uuid: '84539fd3-842c-46a7-a595-fc64919badd6',
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2',
      },
      patient: {
        uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763',
      },
    },
  ],
  person: {
    age: 30,
    dead: false,
    deathDate: null,
    display: 'Test Anticoagulation Treatment',
    gender: 'F',
    healthCenter: '',
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763',
  },
});

class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(
    null
  );

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

describe('Component: PatientInfo', () => {
  let component: PatientInfoComponent;
  let fixture: ComponentFixture<PatientInfoComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PatientInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ProgramService,
        PatientProgramService,
        RoutesProviderService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientResourceService,
        {
          provide: AppFeatureAnalytics,
          useFactory: () => {
            return new FakeAppFeatureAnalytics();
          },
          deps: [],
        },
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(mockPatient),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientInfoComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders a page with data about a patient', () => {
    expect(component).toBeTruthy();
    const pageTitle = <HTMLElement>nativeElement.querySelector('h4.component-title');
    expect(pageTitle.innerText).toMatch('Patient Information');
    const sectionHeaders = nativeElement.querySelectorAll('.info_section_title');
    expect(sectionHeaders.length).toEqual(9);
    expect(sectionHeaders[0].innerHTML).toMatch(/Demographics/);
    expect(sectionHeaders[1].innerHTML).toMatch(/Contacts/);
    expect(sectionHeaders[2].innerHTML).toMatch(/Occupation/);
    expect(sectionHeaders[3].innerHTML).toMatch(/Highest Education Level/);
    expect(sectionHeaders[4].innerHTML).toMatch(/Phone Consent/);
    expect(sectionHeaders[5].innerHTML).toMatch(/Address/);
    expect(sectionHeaders[6].innerHTML).toMatch(/Identifiers/);
    expect(sectionHeaders[7].innerHTML).toMatch(/Relationship/);
    expect(sectionHeaders[8].innerHTML).toMatch(/Outreach Locator Map/);
  });

  it('fetches the currently loaded patient OnInit', async(() => {
    expect(component.patient).not.toBeDefined();
    fixture.detectChanges();
    expect(component.patient).toBeDefined();
    expect(component.patient).toEqual(mockPatient);
  }));
});
