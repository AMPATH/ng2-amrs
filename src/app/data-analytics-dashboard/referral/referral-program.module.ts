
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { EtlApi } from '../../etl-api/etl-api.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { analyticsPatientReferralProgramRouting } from './referral-program.routes';
import { ReferralModule } from '../../referral-module/referral-module';
import { PatientProgramService } from '../../patient-dashboard/programs/patient-programs.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';

@NgModule({
  imports: [
    analyticsPatientReferralProgramRouting,
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    ReferralModule,
    NgamrsSharedModule
  ],
  exports: [],
  declarations: [],
  providers: [PatientProgramService, ProgramService],
})
export class AnalyticsPatientReferralProgramModule { }
