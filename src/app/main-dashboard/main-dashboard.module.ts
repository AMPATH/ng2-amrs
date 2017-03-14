import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { dashboardRouting } from './main-dashboard-routing';
import { MainDashboardComponent } from './main-dashboard.component';
import { ClinicDashboardModule } from '../clinic-dashboard/clinic-dashboard.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataListsModule } from '../data-lists/data-lists.module';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MainDashboardGuard } from './main-dashboard.guard';
import { UserService } from '../openmrs-api/user.service';
import { AppState } from '../app.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    NgamrsSharedModule,
    AgGridModule.withComponents([]),
    DataListsModule,
    PatientDashboardModule
  ],
  declarations: [
    MainDashboardComponent
  ],
  providers: [
    MainDashboardGuard,
    UserService,
    AppState
  ],
  exports: [
    MainDashboardComponent
  ]
})
export class MainDashboardModule { }
