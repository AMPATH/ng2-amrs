import { FormOrderMetaDataService } from './../forms/form-order-metadata.service';
import { NgModel } from '@angular/forms';
import { FormVisitTypeSearchComponent } from './form-visit-type-search.component';
import { FormListService } from '../forms/form-list.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: 'form-visit-search', component: FormVisitTypeSearchComponent },
];

@NgModule({
  declarations: [
    FormVisitTypeSearchComponent
  ],
  providers: [
      FormListService,
      PatientProgramResourceService,
      FormOrderMetaDataService
  ],
  imports: [
      RouterModule.forRoot(routes, { useHash: true }),
      BrowserModule, FormsModule
  ]
})

export class FormVisitTypeSearchModule {

}
