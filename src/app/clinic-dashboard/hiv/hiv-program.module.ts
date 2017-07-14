import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';

import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { clinicDashboardHivRouting } from './hiv-program.routes';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { EtlApi } from '../../etl-api/etl-api.module';
import {
    HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';
import { DataListsModule } from '../../data-lists/data-lists.module';
import {
    HivSummaryIndicatorsPatientListComponent
} from '../../hiv-care-lib/hiv-summary-indicators/patient-list.component';

@NgModule({
    imports: [
        clinicDashboardHivRouting,
        HivCareLibModule,
        DateTimePickerModule,
        EtlApi,
        DataListsModule,
        CommonModule
    ],
    exports: [HivSummaryIndicatorComponent,
        HivSummaryIndicatorsPatientListComponent],
    declarations: [
        Moh731ReportComponent,
        HivSummaryIndicatorComponent,
        HivSummaryIndicatorsPatientListComponent],
    providers: [],
})
export class HivProgramModule { }
