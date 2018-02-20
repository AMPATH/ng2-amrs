import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './provider-dashboard.routes';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { ReferralModule } from '../referral-module/referral-module';
import { PatientReferralService } from '../referral-module/services/patient-referral-service';
import { ProgramService } from '../patient-dashboard/programs/program.service';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import {
    ReferralProviderResourceService
} from '../../etl-api/referral-provider-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { MdTabsModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { ProviderDashboardGuard } from './provider-dashboard.guard';
import { ProviderDashboardService } from './services/provider-dashboard.services';
@NgModule({
  imports: [
    DataListsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReferralModule,
    DataListsModule,
    CommonModule,
    FormsModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderDashboardComponent],
  providers: [
    PatientReferralService,
    ProgramService,
    EncounterResourceService,
    ProviderDashboardGuard,
    ProviderDashboardService

  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProviderDashboardModule {
  public static routes = routes;
}
