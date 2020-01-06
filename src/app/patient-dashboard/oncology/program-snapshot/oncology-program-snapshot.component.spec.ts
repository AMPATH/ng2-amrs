import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as _ from 'lodash';
import { of } from 'rxjs';

import { OncologyProgramSnapshotComponent } from './oncology-program-snapshot.component';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { OncologySummaryResourceService } from '../../../etl-api/oncology-summary-resource.service';
import { Patient } from '../../../models/patient.model';

const patient = new Patient({
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
    display: 'Test Oncology Patient',
    gender: 'F',
    healthCenter: '',
    uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763'
  },
  uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763'
});

const mockSummaryData = [
  {
    date_created: '2019-12-31T12:17:06.000Z',
    person_id: 888890,
    uuid: '4475cc96-624b-4d78-8eaa-d48881e6b677',
    encounter_id: 8842128,
    encounter_datetime: '03-07-2019',
    encounter_type: 38,
    encounter_type_name: 'OncologyInitial',
    visit_id: 2091566,
    visit_type_id: 5,
    visit_start_datetime: '03-07-2019',
    location_id: 195,
    program_id: 6,
    is_clinical: 1,
    enrollment_date: '09-07-2019',
    prev_rtc_date: '23-07-2019',
    rtc_date: '14-08-2019',
    diagnosis: 'Breast Cancer - Inflammatory Breast Cancer',
    result_of_diagnosis: 0,
    diagnosis_date: '03-07-2019',
    breast_exam_findings: '',
    via_test_result: '',
    cancer_type: 'Breast Cancer',
    cancer_subtype: 'Inflammatory Breast Cancer',
    breast_cancer_type: 6545,
    non_cancer_diagnosis: null,
    cancer_stage: '',
    overall_cancer_stage_group: '',
    cur_onc_meds: '',
    cur_onc_meds_dose: null,
    cur_onc_meds_frequency: null,
    cur_onc_meds_start_date: null,
    cur_onc_meds_end_date: null,
    oncology_treatment_plan: '',
    chemotherapy: 'NONE',
    current_chemo_cycle: null,
    total_chemo_cycles_planned: null,
    therapeutic_notes: null,
    cancer_diagnosis_status: 9850,
    reasons_for_surgery: null,
    chemotherapy_intent: '',
    chemotherapy_plan: '',
    chemotherapy_regimen: null,
    drug_route: '',
    medication_history: '',
    other_meds_added: '',
    sickle_cell_drugs: null,
    programuuid: '725b5193-3452-43fc-aca3-6a80432d9bfa',
    location_uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
  }
];

const mockLocationObj = {
  name: 'Location Test',
  uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
};

const oncologySummaryServiceStub = {
  getOncologySummary: () => {
    return of(mockSummaryData);
  }
};

const locationResourceServiceStub = {
  getLocationByUuid: () => {
    return of(mockLocationObj);
  }
};

class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }
}

describe('Component: OncologyProgramSnapshotComponent', () => {
  let component: OncologyProgramSnapshotComponent;
  let fixture: ComponentFixture<OncologyProgramSnapshotComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OncologyProgramSnapshotComponent],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        LocalStorageService,
        {
          provide: LocationResourceService,
          useValue: locationResourceServiceStub
        },
        {
          provide: OncologySummaryResourceService,
          useValue: oncologySummaryServiceStub
        },
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologyProgramSnapshotComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    component.programUuid = '725b5193-3452-43fc-aca3-6a80432d9bfa';
    component.patientUuid = '7ce98cb8-9785-4467-91cc-64afa2d59763';
    component.patient = patient;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have all its methods defined', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ngOnDestroy).toBeDefined();
    expect(component.loadOncologyDataSummary).toBeDefined();
  });

  it('should display the patient\'s snapshot summary after the component initializes', async(() => {
    component.patientUuid = patient.uuid;
    fixture.detectChanges();
    expect(component.summaryData).not.toBeDefined('No summary');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.hasLoadedData).toBe(true);
      expect(component.loadingSummary).toBe(false);
      expect(component.hasData).toBe(true);
      expect(component.hasError).toBe(false);
      expect(component.summaryData).toBeDefined();
      const title = <HTMLElement>nativeElement.querySelector('.component-title');
      expect(title.innerHTML).toEqual('Last Encounter');
      const snapshot = <HTMLElement>nativeElement.querySelector('.snapshot-body');
      expect(snapshot.textContent).toContain('Type: ');
      expect(snapshot.textContent).toContain(mockSummaryData[0].encounter_type_name, 'Encounter type');
      expect(snapshot.textContent).toContain('Diagnosis: ');
      expect(snapshot.textContent).toContain(mockSummaryData[0].diagnosis, 'Cancer diagnosis');
      expect(snapshot.textContent).toContain('Previous Chemotherapy: ');
      expect(snapshot.textContent).toContain(mockSummaryData[0].chemotherapy_plan, 'Previous chemotherapy');
      expect(snapshot.textContent).toContain('RTC Date: ');
      expect(snapshot.textContent).toContain(mockSummaryData[0].rtc_date, 'RTC Date');
    });
  }));
});
