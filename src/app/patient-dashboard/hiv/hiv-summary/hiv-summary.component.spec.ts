/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { HivSummaryComponent } from './hiv-summary.component';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { HivSummaryService } from './hiv-summary.service';
import { PatientService } from '../../services/patient.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HivSummaryLatestComponent } from './hiv-summary-latest.component';
import { TabViewModule } from 'primeng/primeng';
import { HivSummaryHistoricalComponent } from './hiv-summary-historical.component';
import { MedicationHistoryComponent } from './medication-history.component';
import { AhdEventsSummaryComponent } from './ahd-events-summary/ahd-events-summary.component';
import { HivPatientClinicalSummaryComponent } from '../patient-clinical-summaries/hiv-patient-clinical-summary.component';
import { PreviousVisitComponent } from './previous-visit.component';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { NgBusyModule } from 'ng-busy';

class MockActivatedRoute {
  public params = Observable.of([{ id: 1 }]);
  public snapshot = {
    queryParams: { filter: '' }
  };
}

describe('Component: Hiv Summary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabViewModule, NgBusyModule],
      providers: [
        ZeroVlPipe,
        HivSummaryService,
        PatientService,
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: AppFeatureAnalytics,
          useFactory: () => {
            return new FakeAppFeatureAnalytics();
          },
          deps: []
        }
      ],
      declarations: [
        HivSummaryComponent,
        HivSummaryLatestComponent,
        HivSummaryHistoricalComponent,
        MedicationHistoryComponent,
        HivPatientClinicalSummaryComponent,
        PreviousVisitComponent,
        ZeroVlPipe,
        PdfViewerComponent,
        AhdEventsSummaryComponent
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  xit('should create an instance', () => {
    const component = TestBed.get(HivSummaryComponent);
    expect(component).toBeTruthy();
  });
});
