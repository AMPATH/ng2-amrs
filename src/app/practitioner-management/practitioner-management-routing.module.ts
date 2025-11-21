import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionerSearchComponent } from './practitioner-search/practitioner-search.component';
import { PractitionerDetailsComponent } from './details/practitioner-details.component';
import { IsClinicalStaffViewerGuard } from '../shared/guards/is-clinical-staff-viewer.guard';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';

const routes: Routes = [
  {
    path: 'search',
    component: PractitionerSearchComponent,
    canActivate: [IsClinicalStaffViewerGuard]
  },
  {
    path: 'profile',
    component: PractitionerDetailsComponent,
    canActivate: [IsClinicalStaffViewerGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FeatureFlagService]
})
export class PractitionerManagementRoutingModule {}
