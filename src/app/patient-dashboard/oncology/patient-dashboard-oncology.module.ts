import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PocHttpInteceptor } from 'src/app/shared/services/poc-http-interceptor';

import { PanelModule, TabViewModule } from 'primeng/primeng';
import { NgxPaginationModule } from 'ngx-pagination';
import { OncologyLandingPageComponent } from './landing-page/landing-page.component';
import { OncologySummaryComponent } from './oncology-summary/oncology-summary.component';
import { OncologySummaryLatestComponent
} from './oncology-summary/oncology-summary-latest.component';
import { OncologyDiagnosisHistoryComponent
} from './diagnosis-history/oncology-diagnosis-history.component';
import { OncologyMedicationHistoryComponent
} from './medication-history/oncology-medication-history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    HttpClientModule,
    PanelModule,
    TabViewModule,
    NgxPaginationModule
  ],
  exports: [
    OncologyLandingPageComponent, OncologySummaryComponent
  ],
  declarations: [
    OncologyLandingPageComponent, OncologySummaryComponent, OncologySummaryLatestComponent,
    OncologyDiagnosisHistoryComponent, OncologyMedicationHistoryComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    }
  ],
})
export class PatientDashboardOncologyModule { }
