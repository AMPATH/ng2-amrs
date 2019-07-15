import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule
} from '@angular/material';

import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { EtlApi } from '../etl-api/etl-api.module';
import { DataListsModule } from '../shared/data-lists/data-lists.module';

@NgModule({
  imports: [
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  exports: [],
  declarations: [],
  providers: [],
})
export class CdmModule { }
