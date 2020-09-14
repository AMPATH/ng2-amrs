import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { HivProgramSnapshotComponent } from './hiv-program-snapshot.component';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

import { of } from 'rxjs';

import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { UserService } from '../../../openmrs-api/user.service';
import { Patient } from '../../../models/patient.model';

const summaryResult = [
  {
    arv_start_date: '2018-07-11T09:00:00.000Z',
    arv_first_regimen: '',
    contraceptive_method: 1107,
    cur_arv_meds: 'LAMIVUDINE, NEVIRAPINE, TENOFOVIR',
    date_created: '2019-09-10T02:38:20.000Z',
    death_date: null,
    discordant_status: 0,
    encounter_datetime: '2019-07-19T05:54:03.000Z',
    encounter_id: 8889835,
    encounter_type: 2,
    encounter_type_name: 'ADULTRETURN',
    enrollment_date: '2019-02-25T21:00:00.000Z',
    enrollment_location_id: 195,
    expected_vl_date: 0,
    hiv_dna_pcr_1: null,
    hiv_start_date: '2019-02-25T21:00:00.000Z',
    is_clinical_encounter: 1,
    location_id: 195,
    location_uuid: '18c343eb-b353-462a-9139-b16606e6b6c2',
    mdt_session_number: 1,
    med_pickup_rtc_date: null,
    out_of_care: null,
    outreach_attempts: null,
    patient_care_status: 6101,
    person_id: 892556,
    prev_arv_end_date: '2019-03-24T21:00:00.000Z',
    prev_arv_start_date: null,
    prev_clinical_datetime_hiv: '2019-07-08T01:44:44.000Z',
    prev_clinical_location_id: 195,
    prev_clinical_rtc_date_hiv: '2019-07-29T21:00:00.000Z',
    prev_encounter_datetime_hiv: '2019-07-17T21:00:00.000Z',
    prev_encounter_type_hiv: 99999,
    prev_rtc_date: '2019-07-29T21:00:00.000Z',
    rtc_date: '2019-07-29T10:00:00.000Z',
    uuid: '4a6ff3c6-6f95-41c1-b403-cd210ab7afba',
    vl_1: 2000,
    vl_1_date: '2019-03-17T11:00:00.000Z'
  }
];

class FakeHivSummaryResourceService {
  constructor() {
  }

  getHivSummary(patientUuid, startIndex, size) {
    return of(summaryResult);
  }
}

class FakeAppSettingsService {
  constructor() {
  }

  getOpenmrsServer() {
    return 'openmrs-url';
  }

  getOpenmrsRestbaseurl() {
    return 'openmrs-rest-url';
  }
}

class FakeLocationResourceService {
  constructor() {
  }

  getLocationByUuid(locationUuid, fromCache) {
    return of(
      {
        name: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      }
    );
  }
}

class FakeUserDefaultPropertiesService {
  constructor() {}

  getCurrentUserDefaultLocation() {
    return 'Location Test';
  }
}

class FakeEncounterResourceService {
  constructor() {}

  getEncounterByUuid(encounterUuid: string) {
    return of(
      {
        encounterDatetime: '2019-02-25T11:15:14.000+0300',
        encounterType: {
          display: 'ADULTINITIAL',
          uuid: '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f'
        },
        form: {
          name: 'AMPATH POC Adult Return Visit Form v1.5',
          uuid: 'e44b0612-33d6-4ea7-8334-a8286876146b'
        },
        location: {
          display: 'Location Test',
          uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
        },
        patient: {
          uuid: '4a6ff3c6-6f95-41c1-b403-cd210ab7afba'
        },
        uuid: 'd673c1d7-718b-4f5c-83a9-4709f4922af9',
        visit: {
          visitType: {
            name: 'RETURN HIV CLINIC VISIT'
          },
          display: 'RETURN HIV CLINIC VISIT @ Location Test - 02/25/2019 09:25',
          startDatetime: '2019-06-07T09:25:21.000+0300',
          stopDatetime: null
        },
        obs: [
          {
            uuid: 'c1fe5975-dab5-4bdd-911b-fb81b3769f6b',
            obsDatetime: '2019-06-07T11:15:44.000+0300',
            concept: {
              uuid: '315472dc-2b5e-4add-b3b7-bbcf21a8959b',
              name: {
                display: 'MORISKY 4 MEDICATION ADHERENCE, TOTAL SCORE'
              }
            },
            value: 0,
            groupMembers: null
          }
        ]
      }
    );
  }
}

const testPatient = new Patient({
  allIdentifiers: '742403208-9,99966667',
  commonIdentifiers: {
    ampathMrsUId: '742403208-9',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '742403208-9 - test Noble kakamegatest',
  encounters: [
    {
      encounterDatetime: '2019-07-19T08:54:03.000+0300',
      encounterType: {
        display: 'ADULTRETURN',
        uuid: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f'
      },
      form: {
        name: 'AMPATH POC Adult Return Visit Form v1.5',
        uuid: 'bcb914ea-1e03-4c7f-9fd5-1baba5841e78'
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      },
      patient: {
        uuid: '4a6ff3c6-6f95-41c1-b403-cd210ab7afba'
      },
      uuid: '97d0173d-7665-418d-a812-638c7798868f'
    }
  ],
  uuid: '4a6ff3c6-6f95-41c1-b403-cd210ab7afba'
});

describe('Component: HivProgramSnapshotComponent', () => {
  let hivService: HivSummaryResourceService;
  let appSettingsService: AppSettingsService;
  let component: HivProgramSnapshotComponent;
  let fixture: ComponentFixture<HivProgramSnapshotComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ZeroVlPipe,
        {
          provide: HivSummaryResourceService,
          useClass: FakeHivSummaryResourceService
        },
        {
          provide: AppSettingsService,
          useClass: FakeAppSettingsService
        },
        {
          provide: LocationResourceService,
          useClass: FakeLocationResourceService
        },
        {
          provide: EncounterResourceService,
          useClass: FakeEncounterResourceService
        },
        LocalStorageService,
        SessionStorageService,
        {
          provide: UserDefaultPropertiesService,
          useClass: FakeUserDefaultPropertiesService
        },
        UserService
      ],
      declarations: [HivProgramSnapshotComponent, ZeroVlPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HivProgramSnapshotComponent);
    component = fixture.componentInstance;
    appSettingsService = TestBed.get(AppSettingsService);
    hivService = TestBed.get(HivSummaryResourceService);
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;

    component.patient = testPatient;
    component.hasMoriskyScore = true;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.hasError).toEqual(false);
    expect(component.hasData).toEqual(false);
    expect(component.patientData).toEqual({});
    expect(component.latestEncounterLocation).toEqual({});
    done();
  });

  it('should have all of its methods defined', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.getHivSummary).toBeDefined();
    expect(component.resolveLastEncounterLocation).toBeDefined();
    expect(component.getPatientCareStatus).toBeDefined();
    expect(component.getMoriskyScore).toBeDefined();
    expect(component.getPreviousEncounters).toBeDefined();
    expect(component.getPreviousEncounterDetails).toBeDefined();
    expect(component.getLastAdultReturnEncounterDate).toBeDefined();
    expect(component.getMorisky4).toBeDefined();
    expect(component.getMorisky8).toBeDefined();
    expect(component.setNullMorisky).toBeDefined();
    expect(component.getMaximumDate).toBeDefined();
  });

  it('should fetch the patient\'s hiv summary and morisky score when the component initializes', async(() => {
    expect(component.hasError).toEqual(false);
    expect(component.hasData).toEqual(false);
    fixture.detectChanges();
    expect(component.hasData).toEqual(false);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.hasError).toEqual(false);
      expect(component.loadingData).toEqual(false);
      expect(component.hasLoadedData).toEqual(true);
      expect(component.patientCareStatus).toEqual(6101); // Continue with care
      expect(component.moriskyScore).toEqual(0);
      expect(component.moriskyDenominator).toEqual('/4');
      expect(component.moriskyScore4).toEqual(0);
      expect(component.moriskyScore8).toBeFalsy();
      expect(component.moriskyRating).toEqual('Good');
      expect(component.isMoriskyScorePoorOrInadequate).toEqual(false);
      const locationName = <HTMLElement>nativeElement.querySelector('div.full-width');
      expect(locationName.innerText).toContain('Location Test');
      const snapshotRows = nativeElement.querySelectorAll('div.col-md-6.col-xs-12');
      expect(snapshotRows[0].textContent).toContain('Date: 19-07-2019');
      expect(snapshotRows[1].textContent).toContain('Type: ADULTRETURN');
      expect(snapshotRows[2].textContent).toContain('ARV Regimen: LAMIVUDINE, NEVIRAPINE, TENOFOVIR');
      expect(snapshotRows[3].textContent).toContain('Last Viral Load: 2000  (17-03-2019)');
      expect(snapshotRows[4].textContent).toContain('RTC Date: 29-07-2019');
      expect(snapshotRows[5].textContent).toContain('Care Status:  Continue With Care');
      expect(snapshotRows[7].textContent).toContain('Morisky Score:  0/4 - Good');
      expect(snapshotRows[6].textContent).toContain('Disclosure Status:  No');
    });
  }));

  it('should flag the patient\'s viral load red if VL > 1000 && (vl_1_date > (arv_start_date + 6 months))', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isVirallyUnsuppressed).toBe(true);
      const latestVl = <HTMLElement>nativeElement.querySelector('p.text-bold.red');
      expect(latestVl.classList).toContain('text-bold');
      expect(latestVl.classList).toContain('red');
    });
  }));

  it('should determine the patient care status from the provided concept', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.patientCareStatus).toBeDefined();
      expect(component.patientCareStatus).toEqual(6101);
      const snapshotRows = nativeElement.querySelectorAll('div.col-md-6.col-xs-12');
      expect(snapshotRows[5].textContent).toContain('Care Status:  Continue With Care');
    });
  }));
});
