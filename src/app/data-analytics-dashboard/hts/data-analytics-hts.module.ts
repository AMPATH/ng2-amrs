import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProgramEnrollmentModule } from '../../patients-program-enrollment/patients-program-enrollment.module';
import { DataEntryStatisticsModule } from '../../data-entry-statistics/data-entry-statistics.module';
import { ChangeDepartmentModule } from '../change-department/change-department.module';
import { DataAnalyticsHivModule } from '../hiv/data-analytics-hiv.module';
import { HtsReferralLinkageService } from 'src/app/etl-api/hts-refferal-linkage.service';
import { HtsrefferallinkageRegisterComponent } from './hts-registers/htsrefferallinkage-register/htsrefferallinkage-register.component';
import { dataAnalyticsDashboardHtsRouting } from './data-analytics-hts.routes';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';
import { TabViewModule } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    PatientProgramEnrollmentModule,
    DataEntryStatisticsModule,
    ChangeDepartmentModule,
    DataAnalyticsHivModule,
    TabViewModule,
    NgamrsSharedModule,
    dataAnalyticsDashboardHtsRouting
  ],
  exports: [],
  declarations: [HtsrefferallinkageRegisterComponent],
  providers: [HtsReferralLinkageService]
})
export class DataAnalyticsHtsModule {}
