import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material';
import { AgGridModule } from 'ag-grid-angular';
import { DataListsModule } from '../shared/data-lists/data-lists.module';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { PatientService } from '../patient-dashboard/services/patient.service';
import { ProgramManagerContainerComponent
} from './container/program-manager-container.component';
import { EditProgramComponent } from './edit-program/edit-program.component';
import { NewProgramComponent } from './new-program/new-program.component';
import { ProgramSummaryComponent } from './program-summary/program-summary.component';
import { ProgramWizardComponent } from './program-wizard/program-wizard.component';
import { ProgramWizardStepComponent
} from './program-wizard/program-wizard-step.component';
import { ProgramWizardHeaderComponent } from './program-wizard/program-wizard-header';
import { ProgramManagerBaseComponent } from './base/program-manager-base.component';
import { ProgramReferralStatusComponent
} from './program-referral-status/program-referral-status.component';
import { ProgramManagerService } from './program-manager.service';
import { EditProgramLocationComponent } from './edit-program/edit-program-location.component';
import { StopProgramComponent } from './edit-program/stop-program.component';
import { TransferProgramComponent } from './edit-program/transfer-program.component';
import { UnenrollPatientProgramsComponent
} from './program-unenrollment/unenroll-patient-programs.component';
import { PatientReferralBaseComponent
} from './program-referral-report-base/patient-referral-report-base.component';
import { PatientReferralTabularComponent
} from './program-referral-report-base/patient-referral-tabular.component';
import { PatientReferralService } from './patient-referral-service';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';
import { GroupEnrollmentModule } from '../patient-dashboard/group-enrollment/group-enrollment.module';

@NgModule({
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    DataListsModule,
    AgGridModule,
    NgSelectModule,
    MatTabsModule,
    GroupEnrollmentModule
  ],
  exports: [PatientReferralBaseComponent, PatientReferralTabularComponent,
    ProgramManagerContainerComponent, EditProgramComponent, ProgramWizardComponent,
    NewProgramComponent, ProgramSummaryComponent, ProgramWizardStepComponent,
    ProgramReferralStatusComponent, EditProgramLocationComponent, StopProgramComponent,
    TransferProgramComponent, UnenrollPatientProgramsComponent,
    ProgramWizardHeaderComponent, ProgramManagerBaseComponent],
  declarations: [PatientReferralBaseComponent, PatientReferralTabularComponent,
    ProgramManagerContainerComponent, EditProgramComponent, ProgramWizardComponent,
    NewProgramComponent, ProgramSummaryComponent, ProgramWizardStepComponent,
    EditProgramLocationComponent, StopProgramComponent,
    TransferProgramComponent, UnenrollPatientProgramsComponent,
    ProgramWizardHeaderComponent, ProgramManagerBaseComponent, ProgramReferralStatusComponent],
  providers: [
    ProgramEnrollmentResourceService,
    PatientReferralService,
    ProgramReferralResourceService,
    ProgramManagerService,
    PatientService]

})
export class ProgramManagerModule {
}
