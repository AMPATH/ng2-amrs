import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PractitionerSearchComponent } from './practitioner-search/practitioner-search.component';
import { PractitionerManagementRoutingModule } from './practitioner-management-routing.module';
import { PractitionerDetailModalComponent } from './practitioner-detail/practitioner-detail-modal.component';

@NgModule({
  declarations: [PractitionerSearchComponent, PractitionerDetailModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PractitionerManagementRoutingModule
  ]
})
export class PractitionerManagementModule {}
