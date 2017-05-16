import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { clinicDashboardHivRouting } from './hiv-program.routes';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { EtlApi } from '../../etl-api/etl-api.module';
import {
  HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';

@NgModule({
    imports: [
        clinicDashboardHivRouting,
        HivCareLibModule,
        CommonModule
    ],
    exports: [HivSummaryIndicatorComponent],
    declarations: [Moh731ReportComponent, HivSummaryIndicatorComponent],
    providers: [],
})
export class HivProgramModule { }
