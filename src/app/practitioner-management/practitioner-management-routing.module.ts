import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionerSearchComponent } from './practitioner-search/practitioner-search.component';

const routes: Routes = [{ path: '', component: PractitionerSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionerManagementRoutingModule {}
