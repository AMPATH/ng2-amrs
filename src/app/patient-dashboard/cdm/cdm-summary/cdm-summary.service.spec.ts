/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientService } from '../../services/patient.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/primeng';
import { CdmMedicationHistoryComponent } from './medication-history.component';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { NgBusyModule } from 'ng-busy';
import { CdmSummaryLatestComponent } from './cdm-summary-latest.component';
import { CdmSummaryHistoricalComponent } from './cdm-summary-historical.component';
import { CdmSummaryComponent } from './cdm-summary.component';
import { CdmSummaryService } from './cdm-summary.service';
import { CdmClinicalSummaryComponent } from '../patient-clinical-summaries/cdm-clinical-summary.component';

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
        CdmSummaryService,
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
        CdmSummaryComponent,
        CdmSummaryLatestComponent,
        CdmSummaryHistoricalComponent,
        CdmMedicationHistoryComponent,
        CdmClinicalSummaryComponent,
        PdfViewerComponent
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  xit('should create an instance', () => {
    const component = TestBed.get(CdmSummaryComponent);
    expect(component).toBeTruthy();
  });
});
