import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angulartics2Module } from 'angulartics2';
import { ChartModule } from 'angular2-highcharts';
import { CalendarModule } from 'angular-calendar';

import { clinicDashboardRouting } from './clinic-dashboard-routing';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/src/app/components/date-time-picker';
import { ArtOverviewComponent
} from './clinical-summary-visualization/art-overview/art-overview.component';
import { DateRangeComponent } from './dashboard-filters/date-range/date-range.component';
import { RangeSliderComponent } from './dashboard-filters/range-slider/range-slider.component';
import { IndicatorSelectComponent
} from './dashboard-filters/indicator-selector/indicator-selector.component';
import { GenderSelectComponent
} from './dashboard-filters/gender-selector/gender-selector.component';
import { DashboardFiltersComponent } from './dashboard-filters/dashboard-filters.component';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';

import { TabViewModule, FieldsetModule, ButtonModule, GrowlModule } from 'primeng/primeng';
import { ReportingUtilities } from '../reporting-utilities/reporting-utilities.module';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { SelectModule } from 'angular2-select';
import { BusyModule } from 'angular2-busy';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataListsModule } from '../data-lists/data-lists.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DateTimePickerModule,
    DataListsModule,
    clinicDashboardRouting,
    ReportingUtilities,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    OpenmrsApi,
    SelectModule,
    Angulartics2Module.forChild(),
    ChartModule.forRoot(require('highcharts')),
    BusyModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([])
  ],
  declarations: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    VisualizationComponent,
    ArtOverviewComponent,
    DateRangeComponent,
    RangeSliderComponent,
    DashboardFiltersComponent,
    IndicatorSelectComponent,
    GenderSelectComponent,
    ClinicDashboardComponent
  ],
  providers: [
    ClinicDashboardGuard,
    ClinicDashboardCacheService
  ],
  exports: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    VisualizationComponent,
    DateRangeComponent,
    RangeSliderComponent,
    DashboardFiltersComponent,
    IndicatorSelectComponent,
    GenderSelectComponent,
    ClinicDashboardComponent
  ],
})
export class ClinicDashboardModule {
}
