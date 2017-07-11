import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { CohortListComponent } from './cohort-list.component';
import { AddCohortListComponent } from './add-cohort-list.component';
import { EditCohortListComponent } from './edit-cohort-list.component';
import { ViewCohortListMembersComponent } from './cohort-list-members.component';
import { ShareCohortListComponent } from './share-cohort-list.component';
// import { AddCohortMemberContainerComponent } from './add-cohort-member-container.component';

const patientListCohort: Routes = [

  { path: 'cohort',
    children: [
      { path: '', component: CohortListComponent },
      { path: 'add-cohort', component: AddCohortListComponent },
      { path: ':cohort_uuid/edit-cohort', component: EditCohortListComponent },
      { path: ':cohort_uuid/member', component: ViewCohortListMembersComponent },
      { path: ':cohort_uuid/share-cohort', component: ShareCohortListComponent },
      // { path: ':cohort/add-member', component: AddCohortMemberContainerComponent }
    ]
  }
];
export const cohortRouting: ModuleWithProviders = RouterModule.forChild(patientListCohort);
