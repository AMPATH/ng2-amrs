import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule
} from '@angular/material';
import { AgGridModule } from 'ag-grid-angular/main';
import {
  DateTimePickerModule
} from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { EtlApi } from '../../etl-api/etl-api.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { patientReferralProgramRouting } from './patient-referral-program.routes';
import { ReferralCareLibModule}  from '../../referral-care-lib/referral-care-lib.module';
import { PatientReferralComponent } from './patient-referral.component';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';

@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    patientReferralProgramRouting,
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    ReferralCareLibModule,
    HivCareLibModule
  ],
  exports: [
    PatientReferralComponent
  ],
  declarations: [
    PatientReferralComponent
    ],
  providers: [],
})
export class PatientReferralProgramModule { }
