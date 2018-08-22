
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule
} from '@angular/material';
import {
  DateTimePickerModule
} from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { EtlApi } from '../../etl-api/etl-api.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { analyticsPatientReferralProgramRouting } from './referral-program.routes';
import { ReferralModule } from '../../referral-module/referral-module';
import { PatientProgramService } from '../../patient-dashboard/programs/patient-programs.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';

@NgModule({
  imports: [
    analyticsPatientReferralProgramRouting,
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    ReferralModule
  ],
  exports: [],
  declarations: [],
  providers: [PatientProgramService, ProgramService],
})
export class AnalyticsPatientReferralProgramModule { }
