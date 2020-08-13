import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule
} from '@angular/material';
import { ClinicScheduleLibModule } from '../../clinic-schedule-lib/clinic-schedule-lib.module';
import { CalendarModule } from 'angular-calendar';
import { cdmProgramRouting } from './cdm-program.routes';
import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry';
import { EtlApi } from '../../etl-api/etl-api.module';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { CdmDailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { CdmMonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleClinicFlowComponent
} from './clinic-flow/daily-schedule-clinic-flow.component';
import {
  ProgramVisitEncounterSearchModule
} from '../../program-visit-encounter-search/program-visit-encounter-search.module';
import { GeneralModule } from '../general/general.module';
import { ChangeDepartmentModule } from '../change-department/change-department.module';

@NgModule({
  imports: [
    cdmProgramRouting,
    HivCareLibModule,
    ClinicScheduleLibModule,
    DateTimePickerModule,
    CalendarModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ProgramVisitEncounterSearchModule,
    GeneralModule,
    ChangeDepartmentModule
  ],
  exports: [
  ],
  declarations: [
    CdmDailyScheduleComponent,
    CdmMonthlyScheduleComponent,
    DailyScheduleClinicFlowComponent
  ],
  providers: [],
})
export class CdmModule { }
