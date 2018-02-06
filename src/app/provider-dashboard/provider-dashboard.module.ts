import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PROVIDER_DASHBOARD_ROUTES } from './provider-dashboard.routes';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { ReferralModule } from '../referral-module/referral-module';
import { PatientReferralService } from '../referral-module/services/patient-referral-service';
import { ProgramService } from '../patient-dashboard/programs/program.service';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import {
    ReferralProviderResourceService
} from '../../etl-api/referral-provider-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
@NgModule({
  imports: [
    DataListsModule,
    CommonModule,
    FormsModule,
    ReferralModule,
    RouterModule.forChild(PROVIDER_DASHBOARD_ROUTES)
  ],
  declarations: [ProviderDashboardComponent],
  providers: [
    PatientReferralService,
    ProgramService,
    EncounterResourceService

  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProviderDashboardModule {}
