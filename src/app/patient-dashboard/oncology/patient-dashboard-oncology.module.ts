import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PocHttpInteceptor } from 'src/app/shared/services/poc-http-interceptor';

import { PanelModule } from 'primeng/primeng';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { OncologyLandingPageComponent } from './landing-page/landing-page.component';
import { OncologySummaryComponent } from './oncology-summary/oncology-summary.component';
import { OncologySummaryLatestComponent } from './oncology-summary/oncology-summary-latest.component';
import { OncologyDiagnosisHistoryComponent } from './diagnosis-history/oncology-diagnosis-history.component';
import { OncologyMedicationHistoryComponent } from './medication-history/oncology-medication-history.component';
import { OncologyProgramSnapshotComponent } from './program-snapshot/oncology-program-snapshot.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    HttpClientModule,
    PanelModule,
    TabsModule.forRoot(),
    NgxPaginationModule
  ],
  exports: [
    OncologyLandingPageComponent,
    OncologySummaryComponent,
    OncologyProgramSnapshotComponent
  ],
  declarations: [
    OncologyLandingPageComponent,
    OncologySummaryComponent,
    OncologySummaryLatestComponent,
    OncologyDiagnosisHistoryComponent,
    OncologyMedicationHistoryComponent,
    OncologyProgramSnapshotComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    }
  ]
})
export class PatientDashboardOncologyModule {}
