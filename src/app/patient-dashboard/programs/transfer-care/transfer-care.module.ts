import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule, ConfirmDialogModule, DialogModule, MessagesModule,
  TabViewModule, PanelModule
} from 'primeng/primeng';
import { MdSlideToggleModule, MdTabsModule } from '@angular/material';
import { ProgramService } from '../program.service';
import { PatientService } from '../../services/patient.service';
import { PatientProgramService } from '../patient-programs.service';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { ProgramsTransferCareComponent } from './transfer-care.component';
import { ProgramsTransferCareService } from './transfer-care.service';
import { ProgramsTransferCareFormWizardComponent
} from './transfer-care-form-wizard.component';
import { ProgramsTransferCareGuard } from './transfer-care.guard';
import { ProgramsTransferCareFormWizardGuard } from './transfer-care-forms.guard';
import { TransferCareDialogComponent } from './transfer-care-dialog.component';
import { FormListService } from '../../common/forms/form-list.service';
import { FormListComponent } from '../../common/forms/form-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    MessagesModule,
    TabViewModule,
    PanelModule,
    MdTabsModule,
    MdSlideToggleModule,
    NgamrsSharedModule,
    RouterModule
  ],
  declarations: [
    ProgramsTransferCareFormWizardComponent,
    TransferCareDialogComponent,
    ProgramsTransferCareComponent
  ],
  providers: [
    ProgramsTransferCareGuard,
    ProgramsTransferCareFormWizardGuard,
    PatientService,
    PatientProgramService,
    ProgramService,
    FormListService,
    ProgramsTransferCareService
  ],
  exports: [
    ProgramsTransferCareFormWizardComponent,
    TransferCareDialogComponent,
    ProgramsTransferCareComponent,
  ]
})
export class ProgramTransferCareModule {
}
