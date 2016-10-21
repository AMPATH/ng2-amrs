import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { patientDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    patientDashboardRouting
  ],
  declarations: [
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientSearchComponent,
    PatientDashboardComponent,
    PatientBannerComponent
  ],
  providers: [
    PatientDashboardGuard
  ],
  exports: [
    PatientDashboardComponent
  ]
})
export class PatientDashboardModule { }
