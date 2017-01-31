import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { dashboardRouting } from './main-dashboard-routing';
import { MainDashboardComponent } from './main-dashboard.component';
import { ClinicDashboardModule } from '../clinic-dashboard/clinic-dashboard.module';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MainDashboardGuard } from './main-dashboard.guard';
import { UserService } from '../openmrs-api/user.service';
import { OnlineTrackerComponent } from '../online-tracker';
import { BuildVersionComponent } from '../build-version';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    NgamrsSharedModule
  ],
  declarations: [
    MainDashboardComponent,

    OnlineTrackerComponent,
    BuildVersionComponent
  ],
  providers: [
    MainDashboardGuard,
    UserService
  ],
  exports: [
    MainDashboardComponent,
    OnlineTrackerComponent,
    BuildVersionComponent
  ]
})
export class MainDashboardModule { }
