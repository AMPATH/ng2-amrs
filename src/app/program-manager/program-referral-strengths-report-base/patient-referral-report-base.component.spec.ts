import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { FormsModule } from '@angular/forms';

import { ReportFiltersComponent } from '../../shared/report-filters/report-filters.component';
import { StrengthsPatientReferralBaseComponent } from './patient-referral-report-base.component';

import { AppSettingsService } from '../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataAnalyticsDashboardService } from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../openmrs-api/program-workflow-resource.service';
import { SelectDepartmentService } from '../../shared/services/select-department.service';

class MockCacheStorageService {
  constructor(a, b) {}

  public ready() {
    return true;
  }
}

const mockResponse = {
  groupedResult: [
    {
      location: 'Location Test',
      locationId: 195,
      locationUuids: '18c343eb-b353-462a-9139-b16606e6b6c2',
      programs: [
        {
          counts: 3,
          location: 'Location Test',
          locationUuids: '18c343eb-b353-462a-9139-b16606e6b6c2',
          location_id: 195,
          program: 'BREAST CANCER SCREENING',
          programUuids: '142939b0-28a9-4649-baf9-a9d012bf3b3d'
        }
      ]
    }
  ],
  result: [
    {
      counts: 3,
      location: 'Location Test',
      locationUuids: '18c343eb-b353-462a-9139-b16606e6b6c2',
      location_id: 195,
      program: 'BREAST CANCER SCREENING',
      programUuids: '142939b0-28a9-4649-baf9-a9d012bf3b3d'
    }
  ],
  results: [
    {
      counts: 3,
      location: 'Location Test',
      locationUuids: '18c343eb-b353-462a-9139-b16606e6b6c2',
      location_id: 195,
      program: 'BREAST CANCER SCREENING',
      programUuids: '142939b0-28a9-4649-baf9-a9d012bf3b3d'
    }
  ]
};

const mockProcessedResponse = [
  {
    counts: 3,
    location: 'Location Test',
    locationUuids: '18c343eb-b353-462a-9139-b16606e6b6c2',
    location_id: 195,
    program: 'BREAST CANCER SCREENING',
    programUuids: '142939b0-28a9-4649-baf9-a9d012bf3b3d'
  }
];

const mockErrorResponse = new HttpErrorResponse({
  error: 'Internal Server Error',
  status: 500,
  statusText: 'An internal server error occurred'
});

let component;
let fixture: ComponentFixture<StrengthsPatientReferralBaseComponent>;
let patientReferralResourceService;
let selectDepartmentService;
let getUserSetDepartmentSpy;

describe('StrengthsPatientReferralBaseComponent', () => {
  beforeEach(() => {
    patientReferralResourceService = jasmine.createSpyObj(
      'PatientReferralResourceService',
      ['getPatientReferralReport']
    );
    selectDepartmentService = jasmine.createSpyObj('SelectDepartmentService', [
      'getUserSetDepartment'
    ]);
    getUserSetDepartmentSpy = selectDepartmentService.getUserSetDepartment.and.returnValue(
      'ONCOLOGY'
    );

    TestBed.configureTestingModule({
      declarations: [
        StrengthsPatientReferralBaseComponent,
        ReportFiltersComponent
      ],
      providers: [
        AppSettingsService,
        CacheService,
        DataAnalyticsDashboardService,
        DataCacheService,
        DepartmentProgramsConfigService,
        IndicatorResourceService,
        LocalStorageService,
        {
          provide: PatientReferralResourceService,
          useValue: patientReferralResourceService
        },
        ProgramResourceService,
        ProgramWorkFlowResourceService,
        {
          provide: SelectDepartmentService,
          useValue: selectDepartmentService
        },
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ],
      imports: [HttpClientTestingModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StrengthsPatientReferralBaseComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should have all of its methods defined', () => {
    expect(component.generateReport).toBeDefined();
    expect(component.getSelectedPrograms).toBeDefined();
    expect(component.onTabChanged).toBeDefined();
  });

  it('should generate patient referral report from the parameters provided', () => {
    fixture.detectChanges();
    const getPatientReferralReportSpy = patientReferralResourceService.getPatientReferralReport.and.returnValue(
      of(mockResponse)
    );
    // report hasn't been generated yet
    expect(component.encounteredError).toBeFalsy();
    expect(component.errorMessage).toEqual('');
    // generate report
    component.programs = '142939b0-28a9-4649-baf9-a9d012bf3b3d';
    component.generateReport();
    expect(getUserSetDepartmentSpy).toHaveBeenCalledTimes(1);
    expect(component.isLoadingReport).toBeFalsy();
    expect(component.data).toBeDefined();
    expect(component.data).toEqual(mockProcessedResponse);
    expect(component.data[0].location).toEqual('Location Test');
    expect(component.data[0].locationUuids).toEqual(
      '18c343eb-b353-462a-9139-b16606e6b6c2'
    );
    expect(component.data[0].location_id).toEqual(195);
    expect(component.data[0].program).toEqual('BREAST CANCER SCREENING');
    expect(component.data[0].programUuids).toEqual(
      '142939b0-28a9-4649-baf9-a9d012bf3b3d'
    );
  });

  it('should report errors when generating patient referral report fails', () => {
    fixture.detectChanges();
    // report hasn't been generated yet
    expect(component.encounteredError).toBeFalsy();
    expect(component.errorMessage).toEqual('');
    component.generateReport();
    component.locationUuids = 'xxxx';
    const getPatientReferralReportSpy = patientReferralResourceService.getPatientReferralReport.and.callFake(
      () => {
        return throwError(mockErrorResponse);
      }
    );
    // generate report
    component.programs = '142939b0-28a9-4649-baf9-a9d012bf3b3d';
    component.generateReport();
    expect(getUserSetDepartmentSpy).toHaveBeenCalledTimes(1);
    expect(component.encounteredError).toBeTruthy();
    expect(component.errorMessage).toEqual(mockErrorResponse);
    expect(component.data.length).toEqual(0);
  });

  it('should display an error when no program is selected and clear the error when a program is selected', () => {
    fixture.detectChanges();
    component.programs = [];
    component.generateReport();
    // no error message
    expect(component.msgObj).toBeDefined();
    expect(component.msgObj.message).toEqual(
      'Kindly select at least one program'
    );
    expect(component.msgObj.show).toBeTruthy();
    fixture.detectChanges();
    const getPatientReferralReportSpy = patientReferralResourceService.getPatientReferralReport.and.returnValue(
      of(mockResponse)
    );
    component.programs = '142939b0-28a9-4649-baf9-a9d012bf3b3d';
    component.generateReport();
    // error message
    expect(component.msgObj.message).toEqual('');
    expect(component.msgObj.show).toBeFalsy();
  });
});
