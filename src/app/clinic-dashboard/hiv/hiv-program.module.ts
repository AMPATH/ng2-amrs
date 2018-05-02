import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule
} from '@angular/material';
import {
    DateTimePickerModule
} from 'ng2-openmrs-formentry/dist/components/date-time-picker';

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
import { Moh731MonthlyVizComponent
} from './moh731-monthly-viz/moh731-monthly-viz.component';

import {
    KibanaLibModule
} from '../../kibana-lib';

@NgModule({
    imports: [
        clinicDashboardHivRouting,
        HivCareLibModule,
        DateTimePickerModule,
        EtlApi,
        DataListsModule,
        CommonModule,
        FormsModule,
        MdTabsModule,
        MdProgressSpinnerModule,
        MdProgressBarModule,
        KibanaLibModule
    ],
    exports: [HivSummaryIndicatorComponent,
      DailyScheduleClinicFlowComponent,
      PatientsRequiringVLComponent],
    declarations: [
        Moh731ReportComponent,
        HivSummaryIndicatorComponent,
        DailyScheduleClinicFlowComponent,
        PatientsRequiringVLComponent,
        Moh731MonthlyVizComponent,
       // HivSummaryIndicatorsPatientListComponent,
      HivCareComparativeComponent],
    providers: [],
})
export class HivProgramModule { }
