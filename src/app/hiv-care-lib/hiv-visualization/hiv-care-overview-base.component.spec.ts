


import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { ReportFiltersComponent } from '../../shared/report-filters/report-filters.component';
import {
  HivCareComparativeOverviewBaseComponent
} from './hiv-care-overview-base.component';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../etl-api/clinical-summary-visualization-resource.service';
import {
  ClinicalVisualizationResourceServiceMock
} from '../../etl-api/clinical-summary-visualization.service.mock';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';

describe('HivCareComparativeOverviewBaseComponent:', () => {
  let fixture: ComponentFixture<HivCareComparativeOverviewBaseComponent>;
  let comp: HivCareComparativeOverviewBaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HivCareComparativeOverviewBaseComponent,
        // ReportFilters
      ],
      providers: [
        {
          provide: ClinicalSummaryVisualizationResourceService,
          useClass: ClinicalVisualizationResourceServiceMock
        },
        DataAnalyticsDashboardService
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HivCareComparativeOverviewBaseComponent);
      comp = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.visualizationResourceService
      instanceof ClinicalVisualizationResourceServiceMock)
      .toBe(true);
  });

  it('should generate hiv care comparative report using paramaters supplied',
    (done) => {
      const fakeReply: any = {
        result: [
          {
            'reporting_date': '2016-07-30T21:00:00.000Z',
            'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
            'location_id': 1,
            'reporting_month': '07/2016',
            'currently_in_care_total': 3289,
            'on_art_total': 3170,
            'not_on_art_total': 119,
            'patients_requiring_vl': 2828,
            'tested_appropriately': 2506,
            'not_tested_appropriately': 322,
            'due_for_annual_vl': 86,
            'pending_vl_orders': 0,
            'missing_vl_order': 322,
            'perc_tested_appropriately': 88.6139,
            'virally_suppressed': 2236,
            'not_virally_suppressed': 270,
            'perc_virally_suppressed': 89.2259
          }
        ]
      };

      comp = fixture.componentInstance;
      const service = fixture.componentInstance.visualizationResourceService;
      const hivSpy = spyOn(service, 'getHivComparativeOverviewReport')
        .and.callFake(({ endDate: endDate, startDate: startDate,
          indicators: indicators, locationUuids: locationUuids }) => {
          const subject = new Subject<any>();

          // check for params conversion accuracy
          expect(endDate).toEqual('2017-02-01T03:00:00+03:00');
          expect(startDate).toEqual('2017-01-01T03:00:00+03:00');
          // expect(locationUuids).toBe('uuid-1,uuid-2');

          // check for state during fetching
          expect(comp.isLoadingReport).toBe(true);
          expect(comp.encounteredError).toBe(false);
          expect(comp.errorMessage).toBe('');
          setTimeout(() => {
            subject.next(fakeReply);

            // check for state after successful loading
            expect(comp.isLoadingReport).toBe(false);
            expect(comp.encounteredError).toBe(false);
            expect(comp.errorMessage).toBe('');
            done();
          });

          return subject.asObservable();
        });

      // simulate user input
      comp.startDate = new Date('2017-01-01');
      comp.endDate = new Date('2017-02-01');
      // comp.locationUuids = ['uuid-1', 'uuid-2'];

      // simulate previous erroneous state
      comp.isLoadingReport = false;
      comp.encounteredError = true;
      comp.errorMessage = 'some error';
      fixture.detectChanges();
      comp.generateReport();

    });

  it('should report errors when generating hiv care comparative report fails',
    (done) => {
      comp = fixture.componentInstance;
      const service = fixture.componentInstance.visualizationResourceService;
      const hivSpy = spyOn(service, 'getHivComparativeOverviewReport')
        .and.callFake((locationUuids, startDate, endDate) => {
          const subject = new Subject<any>();

          setTimeout(() => {
            subject.error('some error');

            // check for state after successful loading
            expect(comp.isLoadingReport).toBe(false);
            expect(comp.encounteredError).toBe(true);
            expect(comp.errorMessage).toEqual('some error');

            // results should be set
            expect(comp.data).toEqual([]);
            done();
          });

          return subject.asObservable();
        });
      comp.generateReport();
    });

});
