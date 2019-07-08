import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SurgeReportTabularComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-tabular.component';
import { PatientListComponent } from 'src/app/shared/data-lists/patient-list/patient-list.component';
import { SurgeReportBaseComponent } from './surge-report-base.component';

const routes = [{
  path: 'test',
  component: SurgeReportTabularComponent
}];

const fakeReply: any[] = [{
  'results': [
    {
      'location_uuid': '294efcca-cf90-40da-8abb-1e082866388d',
      'location': 'St. Luke\'s',
      'scheduled_this_week': 3,
      'visit_this_week': 3,
      'on_schedule': 18,
      'unscheduled_this_week': 1,
      'early_appointment': 75,
      'late_appointment_this_week': 125,
      'missed_appointment_this_week': 1,
      'ltfu': 105,
      'defaulted': 6,
    }
  ],
  'sectionDefinitions': [
    {
      'sectionTitle': 'Visits',
      'indicators': [
        {
          'label': 'Locations',
          'description': 'the test location',
          'indicator': 'location'
        }
      ]
    }
  ]
}];


describe('SurgeReportTabularComponent', () => {
  let comp: SurgeReportTabularComponent;
  let fixture: ComponentFixture<SurgeReportTabularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SurgeReportTabularComponent,
        SurgeReportBaseComponent,
        PatientListComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SurgeReportTabularComponent);
    comp = fixture.componentInstance;
    comp.surgeReportSummaryData = fakeReply;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(comp).toBeTruthy();
  });

  it('should convert surge report section definition object to ag-grid column definition object', () => {
    const sectionDefinitions = fakeReply[0].sectionDefinitions;

    fixture.detectChanges();
    comp.setColumns(sectionDefinitions);

    const expected = [
      {
        'headerName': 'Visits',
        'children': [
           {
              'headerName': 'Locations',
              'field': 'location',
              'description': 'the test location',
              'value': [
                    {'value' : '-'}
              ],
              'width': 360
           }
        ]
     }
    ];

    expect(JSON.stringify(comp.gridOptions.columnDefs))
        .toEqual(JSON.stringify(expected));


  });
});
