import { FormOrderMetaDataService } from './../forms/form-order-metadata.service';
import { FormVisitTypeSearchComponent } from './form-visit-type-search.component';
import { FormListService } from '../forms/form-list.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  { path: '', component: FormVisitTypeSearchComponent }
];
export const visitTypeSearchRoutes: ModuleWithProviders =
  RouterModule.forChild(routes);
@NgModule({
  declarations: [FormVisitTypeSearchComponent],
  providers: [
    FormListService,
    PatientProgramResourceService,
    FormOrderMetaDataService
  ],
  imports: [visitTypeSearchRoutes, FormsModule, CommonModule]
})
export class FormVisitTypeSearchModule {}
