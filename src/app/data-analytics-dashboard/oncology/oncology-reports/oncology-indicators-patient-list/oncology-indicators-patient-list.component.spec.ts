import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { of, ReplaySubject } from 'rxjs';

import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { OncologySummaryIndicatorsResourceService } from '../../../../etl-api/oncology-summary-indicators-resource.service';
import { OncologySummaryIndicatorsPatientListComponent } from './oncology-indicators-patient-list.component';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../../shared/services/data-cache.service';

let oncologySummaryIndicatorsResourceServiceSpy;
let getOncologySummaryMonthlyIndicatorsPatientListSpy;

const mockParams = {
  endAge: '120',
  endDate: '2019-01-31',
  gender: 'F',
  indicators: 'total_breast_screened',
  limit: '1000',
  locationName: 'Turbo',
  locationUuids: '08feb2dc-1352-11df-a1f1-0026b9348838',
  period: 'monthly',
  startAge: '0',
  startDate: '2019-01-01',
  startIndex: '0',
  type: 'breast_cancer_screening_numbers'
};

const mockResults = {
  patientListCols: [
    'encounter_datetime',
    'location_name',
    'identifiers',
    'person_name',
    'gender',
    'age',
    'phone_number',
    'type_of_abnormality',
    'patient_uuid'
  ],
  results: {
    results: [
      {
        encounter_datetime: '2019-01-01',
        location_name: 'Test Location 1',
        identifiers: '123456789-1',
        person_id: 11111,
        person_name: 'Test Patient 1',
        gender: 'F',
        age: 20,
        phone_number: null,
        type_of_abnormality: 'Normal',
        patient_uuid: 'a8addb73-f2b3-459b-807e-53c15fdc5e8a'
      },
      {
        encounter_datetime: '2019-01-02',
        location_name: 'Test Location 2',
        identifiers: '123456789-2',
        person_id: 22222,
        person_name: 'Test Patient 2',
        gender: 'F',
        age: 25,
        phone_number: null,
        type_of_abnormality: 'Normal',
        patient_uuid: '6b0341c0-ea60-4731-b0b8-82a76d340786'
      },
      {
        encounter_datetime: '2019-01-03',
        location_name: 'Test Location 3',
        identifiers: '123456789-3',
        person_id: 33333,
        person_name: 'Test Patient 3',
        gender: 'F',
        age: 23,
        phone_number: null,
        type_of_abnormality: 'Normal',
        patient_uuid: '88935b70-9945-48fa-b591-7986bbbcf5d9'
      }
    ]
  }
};

const routerSpy = {};
const httpClientSpy = {};

class ActivatedRouteStub {
  private subject = new ReplaySubject<Params>();

  constructor(initialParams?: Params) {
    this.setQueryParams(initialParams);
  }

  readonly queryParams = this.subject.asObservable();

  setQueryParams(params?: Params) {
    this.subject.next(params);
  }
}

class LocationStub {
  back() {}
}

class MockCacheStorageService {
  constructor(a, b) {}

  public ready() {
    return true;
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

let activatedRoute: ActivatedRouteStub;
let component;
let fixture;
let location: SpyLocation;

describe('OncologySummaryIndicatorsPatientListComponent', () => {
  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setQueryParams(mockParams);
  });

  beforeEach(async(() => {
    oncologySummaryIndicatorsResourceServiceSpy = jasmine.createSpyObj(
      'OncologySummaryIndicatorsResourceService',
      ['getOncologySummaryMonthlyIndicatorsPatientList']
    );

    getOncologySummaryMonthlyIndicatorsPatientListSpy =
      oncologySummaryIndicatorsResourceServiceSpy.getOncologySummaryMonthlyIndicatorsPatientList.and.returnValue(
        of(mockResults)
      );

    TestBed.configureTestingModule({
      declarations: [OncologySummaryIndicatorsPatientListComponent],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        LocalStorageService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Location, useValue: location },
        { provide: Router, useValue: MockRouter },
        { provide: HttpClient, useValue: httpClientSpy },
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        },
        {
          provide: OncologySummaryIndicatorsResourceService,
          useValue: oncologySummaryIndicatorsResourceServiceSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(
      OncologySummaryIndicatorsPatientListComponent
    );
    component = fixture.componentInstance;
    location = fixture.debugElement.injector.get(Location) as SpyLocation;

    spyOn(component, 'generateDynamicPatientListCols').and.callThrough();
    spyOn(component, 'processPatientList').and.callThrough();
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should not have a title after construction', () => {
    expect(component.title).toBe('');
  });

  it('should display a title after the component initializes', () => {
    fixture.detectChanges();
    expect(component.title).toEqual('Total Breast Screened');
    expect(
      getOncologySummaryMonthlyIndicatorsPatientListSpy
    ).toHaveBeenCalledTimes(1);

    const el = fixture.nativeElement.querySelector('h4');
    expect(el.textContent).toContain(
      'Total Breast Screened Patient List for Turbo'
    );
    expect(el.textContent).toContain('from 01 January 2019 to 31 January 2019');
  });

  it('should display a patient list after the component initializes', () => {
    fixture.detectChanges();
    expect(component.generateDynamicPatientListCols).toHaveBeenCalledTimes(1);
    expect(component.oncologySummaryColdef.length).toEqual(10);
    expect(component.oncologySummaryColdef).toContain({
      headerName: '#',
      field: 'no',
      width: 50,
      pinned: true
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Patient Uuid',
      field: 'patient_uuid',
      hide: true
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Encounter Date',
      field: 'encounter_datetime',
      pinned: true,
      width: 100
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Location Name',
      field: 'location_name',
      hide: false
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Identifiers',
      field: 'identifiers',
      hide: false
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Gender',
      field: 'gender',
      hide: false
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Person Name',
      field: 'person_name',
      pinned: true,
      width: 250
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Age',
      field: 'age',
      hide: false
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Phone Number',
      field: 'phone_number',
      hide: false
    });
    expect(component.oncologySummaryColdef).toContain({
      headerName: 'Type Of Abnormality',
      field: 'type_of_abnormality',
      hide: false
    });

    expect(component.processPatientList).toHaveBeenCalledTimes(1);
    expect(component.rowData).toContain({
      no: 1,
      encounter_datetime: '2019-01-01',
      location_name: 'Test Location 1',
      identifiers: '123456789-1',
      person_id: 11111,
      person_name: 'Test Patient 1',
      gender: 'F',
      age: 20,
      phone_number: null,
      type_of_abnormality: 'Normal',
      patient_uuid: 'a8addb73-f2b3-459b-807e-53c15fdc5e8a'
    });
    expect(component.rowData).toContain({
      no: 2,
      encounter_datetime: '2019-01-02',
      location_name: 'Test Location 2',
      identifiers: '123456789-2',
      person_id: 22222,
      person_name: 'Test Patient 2',
      gender: 'F',
      age: 25,
      phone_number: null,
      type_of_abnormality: 'Normal',
      patient_uuid: '6b0341c0-ea60-4731-b0b8-82a76d340786'
    });
    expect(component.rowData).toContain({
      no: 3,
      encounter_datetime: '2019-01-03',
      location_name: 'Test Location 3',
      identifiers: '123456789-3',
      person_id: 33333,
      person_name: 'Test Patient 3',
      gender: 'F',
      age: 23,
      phone_number: null,
      type_of_abnormality: 'Normal',
      patient_uuid: '88935b70-9945-48fa-b591-7986bbbcf5d9'
    });
  });

  it('should return formatted indicator strings', () => {
    const example_indicator1 = 'encounter_datetime';
    const example_indicator2 = 'location_name';
    const example_indicator3 = 'identifiers';
    const example_indicator4 = 'person_name';
    const example_indicator5 = 'gender';
    const example_indicator6 = 'age';
    const example_indicator7 = 'type_of_abnormality';
    const example_indicator8 = 'procedure_done';
    expect(component.translateIndicator(example_indicator1)).toEqual(
      'Encounter Datetime'
    );
    expect(component.translateIndicator(example_indicator2)).toEqual(
      'Location Name'
    );
    expect(component.translateIndicator(example_indicator3)).toEqual(
      'Identifiers'
    );
    expect(component.translateIndicator(example_indicator4)).toEqual(
      'Person Name'
    );
    expect(component.translateIndicator(example_indicator5)).toEqual('Gender');
    expect(component.translateIndicator(example_indicator6)).toEqual('Age');
    expect(component.translateIndicator(example_indicator7)).toEqual(
      'Type Of Abnormality'
    );
    expect(component.translateIndicator(example_indicator8)).toEqual(
      'Procedure Done'
    );
  });
});
