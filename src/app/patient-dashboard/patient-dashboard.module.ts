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
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    patientDashboardRouting, CommonModule, AccordionModule, DataTableModule, SharedModule,NgamrsSharedModule
  ],
  declarations: [
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientSearchComponent,
    PatientDashboardComponent
  ],
  providers: [
    PatientDashboardGuard
  ],
  exports: [
    PatientDashboardComponent, PatientEncountersComponent
  ]
})
export class PatientDashboardModule { }
