import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    DateTimePickerModule
} from 'ngx-openmrs-formentry/dist/ngx-formentry/';

import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { clinicDashboardHivRouting } from './hiv-program.routes';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { EtlApi } from '../../etl-api/etl-api.module';
import {
    HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import {
    PatientsRequiringVLComponent
 } from './patients-requiring-vl/patients-requiring-vl.component';
import { DailyScheduleClinicFlowComponent
} from './clinic-flow/daily-schedule-clinic-flow.component';
import { HivCareComparativeComponent
} from './hiv-visualization/hiv-care-overview.component';
import { RouterModule } from '@angular/router';

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
    exports: [
      RouterModule,
      HivSummaryIndicatorComponent,
      DailyScheduleClinicFlowComponent,
      PatientsRequiringVLComponent],
    declarations: [
        Moh731ReportComponent,
        HivSummaryIndicatorComponent,
        DailyScheduleClinicFlowComponent,
        PatientsRequiringVLComponent,
       // HivSummaryIndicatorsPatientListComponent,
      HivCareComparativeComponent],
    providers: [],
})
export class HivProgramModule { }
