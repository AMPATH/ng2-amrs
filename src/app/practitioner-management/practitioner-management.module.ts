import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PractitionerSearchComponent } from './practitioner-search/practitioner-search.component';
import { PractitionerManagementRoutingModule } from './practitioner-management-routing.module';
import { PractitionerDetailModalComponent } from './dialog/practitioner-detail/practitioner-detail-modal.component';
import { PractitionerDetailsComponent } from './details/practitioner-details.component';

@NgModule({
  declarations: [
    PractitionerSearchComponent,
    PractitionerDetailModalComponent,
    PractitionerDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PractitionerManagementRoutingModule
  ]
})
export class PractitionerManagementModule {}
