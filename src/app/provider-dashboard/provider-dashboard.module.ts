import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdTabsModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';

import { routes } from './provider-dashboard.routes';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { PatientReferralService } from '../referral-module/services/patient-referral-service';
import { ProgramService } from '../patient-dashboard/programs/program.service';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
// import {
//     ReferralProviderResourceService
// } from '../../etl-api/referral-provider-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { SelectModule } from 'angular2-select';
import { ReferralModule } from '../referral-module/referral-module';
import { ProviderDashboardGuard } from './provider-dashboard.guard';
import { ProviderDashboardService } from './services/provider-dashboard.services';
import { DataAnalyticsDashboardService }
from '../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { ProviderDashboardFiltersComponent
} from './dashboard-filters/provider-dashboard-filters.component';
import { ProviderReferralComponent
} from '../referral-module/components/provider/provider-referral.component';

@NgModule({
  imports: [
    DataListsModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    SelectModule,
    MdTabsModule,
    DateTimePickerModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    RouterModule.forChild(routes),
    ReferralModule
  ],
  declarations: [ProviderDashboardComponent,
    ProviderDashboardFiltersComponent,
    ProviderReferralComponent],
  providers: [
    PatientReferralService,
    ProgramService,
    EncounterResourceService,
    ProviderDashboardGuard,
    ProviderDashboardService,
    DataAnalyticsDashboardService
  ],
  exports: [
  ]
})
export class ProviderDashboardModule {
  public static routes = routes;
}
