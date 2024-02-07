import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { registersDashboardHivRouting } from './registers-hiv.routes';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HivClinicFlowResourceService } from '../../etl-api/hiv-clinic-flow-resource.service';
import { DefaulterTracingRegisterComponent } from './defaulter-tracing-register/defaulter-tracing-register.component';
import { RegistersDashboardService } from '../service/registers-dashboard.service';
import { DefaulterRecordComponent } from './defaulter-tracing-register/defaulter-record/defaulter-record.component';

@NgModule({
  imports: [
    registersDashboardHivRouting,
    HivCareLibModule,
    DateTimePickerModule,
    NgamrsSharedModule,
    DataListsModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [RouterModule],
  declarations: [DefaulterTracingRegisterComponent, DefaulterRecordComponent],
  providers: [HivClinicFlowResourceService, RegistersDashboardService]
})
export class RegistersHivModule {}
