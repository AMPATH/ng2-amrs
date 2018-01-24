import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule
} from '@angular/material';
import { AgGridModule } from 'ag-grid-angular/main';
import { TabViewModule } from 'primeng/components/tabview/tabview';


import { EtlApi } from '../etl-api/etl-api.module';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { PatientReferralContainerComponent } from './patient-referral.container.component';
import {
  PatientReferralBaseComponent
} from './patient-referral/patient-referral-report-base.component';
import {
  PatientReferralTabularComponent
} from './patient-referral/patient-referral-tabular.component';
import { HivCareLibModule } from '../hiv-care-lib/hiv-care-lib.module';
import {
  ReferralPatientListComponent
} from './patient-referral/referral-patient-list.component';


@NgModule({
  imports: [
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    HivCareLibModule,
    AgGridModule.withComponents([]),
    TabViewModule
  ],
  exports: [
    PatientReferralContainerComponent,
    PatientReferralBaseComponent,
    PatientReferralTabularComponent,
  ],
  declarations: [
    PatientReferralContainerComponent,
    PatientReferralBaseComponent,
    PatientReferralTabularComponent,
    ReferralPatientListComponent
  ],
  providers: [],
})
export class ReferralCareLibModule { }
