import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular/main';

import { DataEntryStatisticsComponent } from './data-entry-statistics.component';
import { DataEntryStatisticsService } from
'./../etl-api/data-entry-statistics-resource.service';
import { DataEntryStatisticsPatientListComponent } from
'./data-entry-statistics-patient-list.component';
import { DataEntryStatisticsEncountersComponent } from
'./data-entry-statistics-encounters.component';
import { DataEntryStatisticsFiltersComponent } from
'./data-entry-statistics-filters/data-entry-statistics-filters.component';
import { DataEntryStatisticsDailyListComponent } from
'./data-entry-statistics-daily-list/data-entry-statistics-daily-list.component';
import { DataEntryStatisticsMonthlyListComponent } from
'./data-entry-statistics-monthly-list/data-entry-statistics-monthly-list.component';
import { DataEntryStatisticsProviderListComponent } from
'./data-entry-statistics-providers-list/data-entry-statistics-providers-list.component';
import { DataEntryStatisticsCreatorsListComponent } from
'./data-entry-statistics-creators-list/data-entry-statistics-creators-list.component';

@NgModule({
  imports: [
    DateTimePickerModule,
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    AgGridModule
  ],
  exports: [
    DataEntryStatisticsComponent,
    DataEntryStatisticsPatientListComponent,
    DataEntryStatisticsEncountersComponent,
    DataEntryStatisticsFiltersComponent,
    DataEntryStatisticsDailyListComponent,
    DataEntryStatisticsMonthlyListComponent,
    DataEntryStatisticsProviderListComponent,
    DataEntryStatisticsCreatorsListComponent
  ],
  declarations: [
    DataEntryStatisticsComponent,
    DataEntryStatisticsPatientListComponent,
    DataEntryStatisticsEncountersComponent,
    DataEntryStatisticsFiltersComponent,
    DataEntryStatisticsDailyListComponent,
    DataEntryStatisticsMonthlyListComponent,
    DataEntryStatisticsProviderListComponent,
    DataEntryStatisticsCreatorsListComponent
   ],
  providers: [
    DataEntryStatisticsService
  ],
})
export class DataEntryStatisticsModule { }
