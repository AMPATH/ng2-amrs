import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionerSearchComponent } from './practitioner-search/practitioner-search.component';
import { PractitionerDetailsComponent } from './details/practitioner-details.component';

const routes: Routes = [
  {
    path: 'search',
    component: PractitionerSearchComponent
  },
  {
    path: 'profile',
    component: PractitionerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionerManagementRoutingModule {}
