import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular/main';
import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry/';
import { EtlApi } from '../../etl-api/etl-api.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { patientReferralProgramRouting } from './patient-referral-program.routes';
import { PatientReferralComponent } from './patient-referral.component';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { PatientProgramService
} from '../../patient-dashboard/programs/patient-programs.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { ProgramManagerModule } from '../../program-manager/program-manager.module';

@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    patientReferralProgramRouting,
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    HivCareLibModule,
    ProgramManagerModule
  ],
  exports: [
    PatientReferralComponent
  ],
  declarations: [
    PatientReferralComponent
    ],
  providers: [PatientProgramService, ProgramService],
})
export class PatientReferralProgramModule { }
