import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  PatientReferralContainerComponent
} from './components/patient-referral-container.component';
import { ReferralProviderComponent } from
  './components/referral-provider.component';
import { PatientReferralItemComponent } from './components/patient-referral-item.component';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../openmrs-api/program-workflow-state-resource.service';
import { ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { PatientReferralService } from './services/patient-referral-service';
import { PatientReferralVisitComponent } from './components/patient-referral-visit.component';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';
import {
    ReferralProviderResourceService
} from '../etl-api/referral-provider-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  PatientReferralBaseComponent
} from './patient-referral/patient-referral-report-base.component';
import {
  PatientReferralTabularComponent
} from './patient-referral/patient-referral-tabular.component';
import { HivCareLibModule } from '../hiv-care-lib/hiv-care-lib.module';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { AgGridModule } from 'ag-grid-angular/main';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    DataListsModule,
    HivCareLibModule,
    AgGridModule.withComponents([]),
    TabViewModule
  ],
  exports: [
  PatientReferralContainerComponent,
  PatientReferralItemComponent,
  PatientReferralVisitComponent,
  ReferralProviderComponent,
  PatientReferralContainerComponent,
  PatientReferralBaseComponent,
  PatientReferralTabularComponent,
  ],
  declarations: [
  PatientReferralContainerComponent,
  PatientReferralItemComponent,
  PatientReferralVisitComponent,
  ReferralProviderComponent,
  PatientReferralContainerComponent,
  PatientReferralBaseComponent,
  PatientReferralTabularComponent,
  ],
  providers: [
    ProgramEnrollmentResourceService,
    ProgramReferralResourceService,
    ProgramWorkFlowResourceService,
    PatientReferralService,
    ProgramWorkFlowStateResourceService,
    ReferralProviderResourceService],

})
export class ReferralModule {
}
