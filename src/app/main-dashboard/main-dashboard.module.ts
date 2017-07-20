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
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortMemberResourceService } from '../openmrs-api/cohort-member-resource.service';
import { PatientListCohortModule } from '../patient-list-cohort/patient-list-cohort.module';
import { MOTDNotificationComponent } from './../Motd/motd-notification.component';
import { MOTDNotificationService } from './../etl-api/motd.notification.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { DataAnalyticsModule } from '../data-analytics-dashboard/data-analytics.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    NgamrsSharedModule,
    AgGridModule.withComponents([]),
    DataListsModule,
    PatientListCohortModule,
    PatientDashboardModule,
    DataAnalyticsModule
  ],
  declarations: [
    MainDashboardComponent,
    MOTDNotificationComponent
  ],
  providers: [
    MainDashboardGuard,
    UserService,
    AppState,
    CohortResourceService,
    CohortMemberResourceService,
    MOTDNotificationService,
    CookieService
  ],
  exports: [
    MainDashboardComponent
  ]
})
export class MainDashboardModule { }
