import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { dashboardRouting } from './main-dashboard-routing';
import { MainDashboardComponent } from './main-dashboard.component';
import { UserDefaultPropertiesModule } from '../user-default-properties/';
import { AgGridModule } from 'ag-grid-angular/main';
import { LabOrderSearchModule } from '../lab-order-search';
import { UsefulLinksModule } from '../useful-links';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MainDashboardGuard } from './main-dashboard.guard';
import { UserService } from '../openmrs-api/user.service';
import { AppState } from '../app.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortMemberResourceService } from '../openmrs-api/cohort-member-resource.service';
import { MOTDNotificationComponent } from './../Motd/motd-notification.component';
import { MOTDNotificationService } from './../etl-api/motd.notification.service';
import { CookieService } from 'ngx-cookie';
import { NavigationModule } from '../navigation';
import { RetrospectiveDataEntryModule } from '../retrospective-data-entry/retrospective-data-entry.module';
import { PractitionerManagementModule } from '../practitioner-management/practitioner-management.module';
import { FacilityManagementModule } from '../facility-management/facility-management.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    NavigationModule,
    NgamrsSharedModule,
    AgGridModule.withComponents([]),
    DataListsModule,
    LabOrderSearchModule,
    UsefulLinksModule,
    UserDefaultPropertiesModule,
    RetrospectiveDataEntryModule,
    PractitionerManagementModule,
    FacilityManagementModule
  ],
  declarations: [MainDashboardComponent, MOTDNotificationComponent],
  providers: [
    MainDashboardGuard,
    UserService,
    AppState,
    CohortResourceService,
    CohortMemberResourceService,
    MOTDNotificationService,
    CookieService
  ],
  exports: [MainDashboardComponent]
})
export class MainDashboardModule {}
