/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { AgGridModule } from 'ag-grid-angular/main';

import { RetentionReportTabularComponent } from './retention-report-tabular.component';

describe('Component : RetentionReportTabularComponent: ', () => {
  let fixture: ComponentFixture<RetentionReportTabularComponent>;
  let comp: RetentionReportTabularComponent;
  let router: Router;
  let route: ActivatedRoute;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockParams = {
    endDate: '2019-09-30',
    locationUuids: ['luuid'],
    startDate: '2019-09-30'
  };
  const mockActivatedRoute = {
    queryParams: {
      subscribe: jasmine.createSpy('subscribe').and.returnValue(of(mockParams))
    }
  };

  const mockSectionDefs = [
    {
      sectionTitle: 'Appointment Adherenace',
      indicators: [
        {
          label: 'Patients Scheduled',
          ref: '',
          indicator: 'patients_scheduled'
        },
        {
          label: 'Attended clinic on the date scheduled',
          ref: '',
          indicator: 'attended_clinic_on_date_scheduled'
        }
      ]
    }
  ];

  const mockRowDefs = [];
  mockRowDefs['patients_scheduled'] = {
    indicator: 'patients_scheduled',
    section: 'Appointment Adherenace',
    data: [],
    location_uuid: ''
  };
  mockRowDefs['attended_clinic_on_date_scheduled'] = {
    indicator: 'attended_clinic_on_date_scheduled',
    section: 'Appointment Adherenace',
    data: [],
    location_uuid: ''
  };

  const mockResults = [
    {
      attended_clinic_on_date_scheduled: 41,
      deceased: 0,
      defaulted: 32,
      report_date: '2019-10-01'
    },
    {
      attended_clinic_on_date_scheduled: 42,
      deceased: 0,
      defaulted: 15,
      report_date: '2019-10-02'
    },
    {
      attended_clinic_on_date_scheduled: 43,
      deceased: 0,
      defaulted: 30,
      report_date: '2019-10-03'
    }
  ];

  const mockColumnDefs = [
    {
      headerName: 'Report',
      field: 'section',
      pinned: 'left',
      rowGroup: true,
      hide: true
    },
    {
      headerName: 'Indicator',
      field: 'indicator',
      width: 400,
      cellRenderer: function (column) {}
    },
    {
      headerName: '01-10-2019',
      field: '2019-10-01'
    },
    {
      headerName: '02-10-2019',
      field: '2019-10-02'
    },
    {
      headerName: '03-10-2019',
      field: '2019-10-03'
    }
  ];

  const mockIndicator = 'test_indicator';
  const mockIndicatorCol = 'Test Indicator';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionReportTabularComponent],
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [AgGridModule.withComponents([])]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RetentionReportTabularComponent);
      comp = fixture.componentInstance;
      router = fixture.debugElement.injector.get<Router>(Router);
      route = fixture.debugElement.injector.get<ActivatedRoute>(ActivatedRoute);
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injectable', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should generate correct row definitions based on section definitions', () => {
    comp.generateRows(mockSectionDefs);
    fixture.detectChanges();
    expect(comp.rowDefs).toEqual(mockRowDefs);
  });
  it('should generate correct grid columns based on data returned', () => {
    comp.generateColumns(mockResults);
    fixture.detectChanges();
    expect(JSON.stringify(comp.retentionSummaryColdef)).toEqual(
      JSON.stringify(mockColumnDefs)
    );
  });
  it('should create and format column name from indicator', () => {
    const expectedColName = comp.translateIndicator(mockIndicator);
    fixture.detectChanges();
    expect(expectedColName).toEqual(mockIndicatorCol);
  });
});
