import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular/main';
import { TabViewModule } from 'primeng/primeng';

import { Moh731TabularComponent } from './moh-731-report/moh-731-tabular.component';
import { Moh731ReportFilters } from './moh-731-report/moh-731-report-filters.component';
import { Moh731ReportBaseComponent } from './moh-731-report/moh-731-report-base.component';
import { EtlApi } from '../etl-api/etl-api.module';

@NgModule({
    imports: [
        AgGridModule.withComponents([]),
        EtlApi,
        FormsModule,
        CommonModule,
        TabViewModule
    ],
    exports: [
        Moh731TabularComponent,
        Moh731ReportFilters,
        EtlApi,
        CommonModule,
        TabViewModule
    ],
    declarations: [
        Moh731TabularComponent,
        Moh731ReportBaseComponent,
        Moh731ReportFilters,
    ],
    providers: [],
})
export class HivCareLibModule { }
