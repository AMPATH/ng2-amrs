import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule
} from '@angular/material';
import { CalendarModule } from 'angular-calendar';
import { oncologyProgramRouting } from './oncology-program.routes';
import { ClinicScheduleLibModule } from '../../clinic-schedule-lib/clinic-schedule-lib.module';
import {
  DateTimePickerModule
} from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { EtlApi } from '../../etl-api/etl-api.module';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { OncDailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { OncMonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleClinicFlowComponent
} from './clinic-flow/daily-schedule-clinic-flow.component';
import {
  ProgramVisitEncounterSearchModule
} from '../../program-visit-encounter-search/program-visit-encounter-search.module';

@NgModule({
  imports: [
    oncologyProgramRouting,
    HivCareLibModule,
    ClinicScheduleLibModule,
    DateTimePickerModule,
    CalendarModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    ProgramVisitEncounterSearchModule
  ],
  exports: [],
  declarations: [
    OncDailyScheduleComponent,
    OncMonthlyScheduleComponent,
    DailyScheduleClinicFlowComponent
  ],
  providers: [],
})
export class OncologyProgramModule { }
