import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  PatientReferralContainerComponent
} from './components/referral-container/patient-referral-container.component';
import { ReferralProviderComponent } from
  './components/provider/referral-provider.component';
import { PatientReferralItemComponent
} from './components/referral-container/patient-referral-item.component';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../openmrs-api/program-workflow-state-resource.service';
import { ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { PatientReferralService } from './services/patient-referral-service';
import { PatientReferralVisitComponent } from './components/visit/patient-referral-visit.component';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { DialogModule } from 'primeng/primeng';
import { EnrollmentManagerComponent
} from './components/enrollment-manager/enrollment-manager.component';
import { EnrollmentManagerFormWizardComponent
} from './components/enrollment-manager/enrollment-manager-form-wizard.component';
import { PatientService } from '../patient-dashboard/services/patient.service';
import { EnrollementWorkflowService } from './services/enrollment-workflow-service';
import { ProviderReferralComponent } from './components/provider/provider-referral.component';
import { ProviderDashboardFiltersComponent
} from '../provider-dashboard/dashboard-filters/provider-dashboard-filters.component';
import { SelectModule } from 'ng2-select';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { AgGridModule } from 'ag-grid-angular';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import {
  PatientReferralBaseComponent
} from './patient-referral/patient-referral-report-base.component';
import {
  PatientReferralTabularComponent
} from './patient-referral/patient-referral-tabular.component';
@NgModule({
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    DataListsModule,
    DateTimePickerModule,
    SelectModule,
    AgGridModule.withComponents([]),
    TabViewModule,
    DialogModule
  ],
  exports: [
    PatientReferralContainerComponent,
    PatientReferralItemComponent,
    PatientReferralVisitComponent,
    EnrollmentManagerComponent,
    EnrollmentManagerFormWizardComponent,
    PatientReferralBaseComponent,
    PatientReferralTabularComponent,
    ProviderReferralComponent],
  declarations: [
    PatientReferralContainerComponent,
    EnrollmentManagerComponent,
    EnrollmentManagerFormWizardComponent,
    PatientReferralItemComponent,
    PatientReferralVisitComponent,
    ProviderDashboardFiltersComponent,
    ProviderReferralComponent],
  providers: [
    ProgramEnrollmentResourceService,
    ProgramReferralResourceService,
    ProgramWorkFlowResourceService,
    PatientReferralService,
    PatientService,
    EnrollementWorkflowService,
    NgSwitch,
    ProgramWorkFlowStateResourceService]

})
export class ReferralModule {
}
