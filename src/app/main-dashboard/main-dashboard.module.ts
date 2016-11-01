import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { dashboardRouting } from './main-dashboard-routing';
import { MainDashboardComponent } from './main-dashboard.component';
import { ClinicDashboardModule } from '../clinic-dashboard/clinic-dashboard.module';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    ClinicDashboardModule,
    PatientDashboardModule,
    NgamrsSharedModule
  ],
  declarations: [
    MainDashboardComponent
  ],
  providers: [
  ],
  exports: [
    MainDashboardComponent
  ]
})
export class MainDashboardModule { }
