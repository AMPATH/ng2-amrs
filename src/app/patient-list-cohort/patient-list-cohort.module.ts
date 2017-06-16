
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { CohortListComponent } from './cohort-list.component';
import { cohortRouting } from './patient-list-cohort.routes';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { AddCohortListComponent } from './add-cohort-list.component';
import { EditCohortListComponent } from './edit-cohort-list.component';
import { CohortListService } from './cohort-list.service';
import { ViewCohortListMembersComponent } from './cohort-list-members.component';

// patientListCohort,
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    cohortRouting,
    UtilsModule,
    NgamrsSharedModule,
  //  RouterModule.forChild(patientListCohort),
    ConfirmDialogModule, DialogModule,
  ],
  declarations: [CohortListComponent, AddCohortListComponent,
    EditCohortListComponent, ViewCohortListMembersComponent],
  providers: [
    CohortListService
  ],
  exports: [
  //  RouterModule,
    CohortListComponent,
    AddCohortListComponent,
    EditCohortListComponent,
    ViewCohortListMembersComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PatientListCohortModule {}
