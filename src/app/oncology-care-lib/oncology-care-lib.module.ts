import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry/';
import { EtlApi } from '../etl-api/etl-api.module';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
@NgModule({
  imports: [
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule
  ],
  exports: [],
  declarations: [],
  providers: [],

})
export class OncologyProgramModule { }
