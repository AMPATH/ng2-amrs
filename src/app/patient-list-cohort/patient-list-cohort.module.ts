
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';

import { UtilsModule } from '../utils/utils.module';
import { CohortMemberModule } from './cohort-member/cohort-member.module';
import { CohortListComponent } from './cohort-list.component';
import { cohortRouting } from './patient-list-cohort.routes';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { AddCohortListComponent } from './add-cohort-list.component';
import { EditCohortListComponent } from './edit-cohort-list.component';
import { CohortListService } from './cohort-list.service';
import { ViewCohortListMembersComponent } from './cohort-list-members.component';
import { ShareCohortListComponent } from './share-cohort-list.component';
/*import { SelectModule } from 'ng2-select';*/
import { UserSearchComponent } from './user-search.component';
import { Ng2PaginationModule } from 'ng2-pagination';
import { EtlApi } from '../etl-api/etl-api.module';
import { AddCohortMemberContainerComponent } from './add-cohort-member-container.component';

// patientListCohort,
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    cohortRouting,
    UtilsModule,
    NgamrsSharedModule,
    CohortMemberModule,
    ConfirmDialogModule, DialogModule,
    Ng2PaginationModule,
    EtlApi
  ],
  declarations: [CohortListComponent, AddCohortListComponent,
    EditCohortListComponent, ViewCohortListMembersComponent,
    AddCohortMemberContainerComponent,
    ShareCohortListComponent, UserSearchComponent],
  providers: [
    CohortListService
  ],
  exports: [
    //  RouterModule,
    CohortListComponent,
    AddCohortListComponent,
    EditCohortListComponent,
    ViewCohortListMembersComponent,
    ShareCohortListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PatientListCohortModule { }
