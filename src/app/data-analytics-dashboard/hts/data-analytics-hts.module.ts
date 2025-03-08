import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProgramEnrollmentModule } from '../../patients-program-enrollment/patients-program-enrollment.module';
import { DataEntryStatisticsModule } from '../../data-entry-statistics/data-entry-statistics.module';
import { ChangeDepartmentModule } from '../change-department/change-department.module';
import { DataAnalyticsHivModule } from '../hiv/data-analytics-hiv.module';
@NgModule({
  imports: [
    CommonModule,
    PatientProgramEnrollmentModule,
    DataEntryStatisticsModule,
    ChangeDepartmentModule,
    DataAnalyticsHivModule
  ],
  exports: [],
  declarations: [],
  providers: []
})
export class DataAnalyticsHtsModule {}
