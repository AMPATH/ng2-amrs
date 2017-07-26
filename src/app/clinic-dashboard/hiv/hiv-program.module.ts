import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    DateTimePickerModule
} from 'ng2-openmrs-formentry/src/app/components/date-time-picker';

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
import {
    PatientsRequiringVLComponent
 } from './patients-requiring-vl/patients-requiring-vl.component';

@NgModule({
    imports: [
        clinicDashboardHivRouting,
        HivCareLibModule,
        DateTimePickerModule,
        EtlApi,
        DataListsModule,
        CommonModule,
        FormsModule
    ],
    exports: [HivSummaryIndicatorComponent,
        HivSummaryIndicatorsPatientListComponent,
        PatientsRequiringVLComponent],
    declarations: [
        Moh731ReportComponent,
        HivSummaryIndicatorComponent,
        HivSummaryIndicatorsPatientListComponent,
        PatientsRequiringVLComponent],
    providers: [],
})
export class HivProgramModule { }
