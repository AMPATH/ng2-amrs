import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule, DataTableModule, SharedModule } from 'primeng/primeng';

import { patientDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { FormsComponent } from './forms/forms.component';
import { LabDataSummaryComponent } from './lab-data-summary/lab-data-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    patientDashboardRouting, CommonModule, AccordionModule, DataTableModule, SharedModule, NgamrsSharedModule
  ],
  declarations: [
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientSearchComponent,
    PatientDashboardComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent
  ],
  providers: [
    PatientDashboardGuard
  ],
  exports: [
    PatientDashboardComponent,
    PatientEncountersComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent
  ]
})
export class PatientDashboardModule {
}
