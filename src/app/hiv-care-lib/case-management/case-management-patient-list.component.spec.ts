import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagementPatientListComponent } from './case-management-patient-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseManagementComponent } from './case-management.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CaseManagementResourceService } from 'src/app/etl-api/case-management-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { AgGridModule } from 'ag-grid-angular';
import { of, Observable } from 'rxjs';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';

const rowData = [
  {
    identifiers: '621727172-2',
    last_follow_up_date: '2019-12-19 DRUGPICKUP',
    rtc_date: '2020-01-16',
    age: 17,
    days_since_missed_appointment: 126,
    case_manager: 'Tester',
    patient_name: 'Doti Nafula Test',
    gender: 'F',
    last_vl: null,
    last_vl_date: null,
    days_since_follow_up: 154,
    attribute_uuid: '75d1f35d-975d-476a-9cca-235af959c6fd',
    med_pickup_rtc_date: null,
    enrollment_date: '2019-12-19',
    days_since_enrollment: 154,
    encounter_type: 'DRUGPICKUP',
    patient_uuid: '67324dc2-3fce-49ee-91e7-e797866239e2',
    next_phone_appointment: null,
    case_manager_user_id: 164606,
    missed_appointment: 1,
    patients_due_for_vl: 0
  }
];
const mockChangeCaseManager = {
  patient_name: 'locationUuid',
  patient_uuid: 2,
  case_manager: 'Test Manager',
  attribute_uuid: 'uuid'
};
const mockCaseManager = {
  result: [
    {
      location_uuid: 'locationUuid',
      number_assigned: 2,
      person_name: 'Test Manager',
      provider_id: 2,
      user_id: 1,
      user_uuid: 'uuid'
    }
  ]
};
describe('CaseManagementPatientListComponent', () => {
  let component: CaseManagementPatientListComponent;
  let fixture: ComponentFixture<CaseManagementPatientListComponent>;
  let caseManagementResourceService: CaseManagementResourceService;
  class MockCacheStorageService {
    constructor(a, b) {}

    public ready() {
      return true;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AgGridModule.withComponents([])
      ],
      providers: [
        CaseManagementComponent,
        CaseManagementResourceService,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ],
      declarations: [CaseManagementPatientListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagementPatientListComponent);
    caseManagementResourceService = TestBed.get(CaseManagementResourceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('load grid with fake data', () => {
    component.rowData = rowData;
    fixture.detectChanges();
    expect(component.gridOptions.api).toBeTruthy();
    const appElement = fixture.nativeElement;
    const cellElements = appElement.querySelectorAll('.ag-cell-value');
    expect(cellElements.length).toEqual(2);
  });
  it('should have expected column headers', () => {
    component.rowData = rowData;
    component.ngOnInit();
    fixture.detectChanges();

    const elm = fixture.nativeElement;
    const grid = elm.querySelector('ag-grid-angular');
    const headerCells = grid.querySelectorAll('.ag-header-cell-text');
    const headerTitles = Array.from(headerCells).map((cell: any) =>
      cell.textContent.trim()
    );
    expect(headerTitles).toEqual(['No', 'Follow Up']);
  });

  it('first row should have expected data', () => {
    component.rowData = rowData;
    fixture.detectChanges();

    const elm = fixture.nativeElement;
    const grid = elm.querySelector('ag-grid-angular');
    const firstRowCells = grid.querySelectorAll(
      'div[row-id="0"] div.ag-cell-value'
    );
    const values = Array.from(firstRowCells).map((cell: any) =>
      cell.textContent.trim()
    );
    expect(values).toEqual(['Follow Up']);
  });
  it('load case managers and patient info correctly', () => {
    spyOn(caseManagementResourceService, 'getCaseManagers').and.returnValue(
      Observable.of(mockCaseManager)
    );
    component.params.locationUuid = 'test_location';
    component.ngOnInit();
    component.changeManager(mockChangeCaseManager);
    fixture.detectChanges();
    expect(component.display).toBeTruthy();
    expect(component.caseManagers.length).toEqual(1);
    expect(component.patient).toEqual(mockChangeCaseManager.patient_name);
    expect(component.patientUuid).toEqual(mockChangeCaseManager.patient_uuid);
    expect(component.attributeUuid).toEqual(
      mockChangeCaseManager.attribute_uuid
    );
  });
});
