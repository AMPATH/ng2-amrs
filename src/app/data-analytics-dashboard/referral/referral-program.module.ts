
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
import { ReferralCareLibModule}  from '../../referral-care-lib/referral-care-lib.module';
import { analyticsPatientReferralProgramRouting } from './referral-program.routes';


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
    ReferralCareLibModule
  ],
  exports: [],
  declarations: [],
  providers: [],
})
export class AnalyticsPatientReferralProgramModule { }
