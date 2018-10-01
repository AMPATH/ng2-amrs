import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'angular2-highcharts';
// import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule,
// MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatDatepickerToggle
// } from '@angular/material';
import {
    DateTimePickerModule
} from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { CalendarModule } from 'angular-calendar';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import {
    TabViewModule, FieldsetModule, ButtonModule, GrowlModule, AccordionModule
} from 'primeng/primeng';
import { NgxPaginationModule } from 'ngx-pagination';
import { EtlApi } from '../../etl-api/etl-api.module';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { ClinicScheduleLibModule } from '../../clinic-schedule-lib/clinic-schedule-lib.module';
import { clinincDashboardGeneralRouting } from './general.routes';
import {
    GeneralDailyScheduleComponent
} from './daily-schedule/daily-schedule.component';
import { GeneralMonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';

import {
ProgramVisitEncounterSearchModule
} from '../../program-visit-encounter-search/program-visit-encounter-search.module';
import { DepartmentProgramFilterModule } from
'./../../department-program-filter/department-program-filter.module';
import { PatientProgramEnrollmentService } from
'./../../etl-api/patient-program-enrollment.service';
import { PatientProgramEnrollmentModule } from
'./../../patients-program-enrollment/patients-program-enrollment.module';
import { DailyScheduleClinicFlowComponent
} from './clinic-flow/daily-schedule-clinic-flow.component';
import { GroupManagerModule } from '../../group-manager/group-manager.module';


@NgModule({
    imports: [
        DateTimePickerModule,
        EtlApi,
        DataListsModule,
        CommonModule,
        FormsModule,
        // MatTabsModule,
        // MatProgressSpinnerModule,
        // MatProgressBarModule,
        // MatDatepickerModule,
        // MatNativeDateModule,
        GroupManagerModule,
        CalendarModule,
        NgamrsSharedModule,
        AgGridModule,
        TabViewModule,
        FieldsetModule,
        ButtonModule,
        GrowlModule,
        AccordionModule,
        clinincDashboardGeneralRouting,
        ChartModule,
        // MatSlideToggleModule,
        PatientProgramEnrollmentModule,
        ProgramVisitEncounterSearchModule,
        DepartmentProgramFilterModule,
        NgxPaginationModule,
        HivCareLibModule,
        ClinicScheduleLibModule
    ],
    exports: [
        DefaulterListComponent,
        ClinicLabOrdersComponent
    ],
    declarations: [
        GeneralDailyScheduleComponent,
        DefaulterListComponent,
        ClinicLabOrdersComponent,
        GeneralMonthlyScheduleComponent,
        DailyScheduleClinicFlowComponent
    ],
    providers: [
        PatientProgramEnrollmentService
    ]
})
export class GeneralModule { }
