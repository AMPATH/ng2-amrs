import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LabOrderSearchComponent } from './lab-order-search.component';
import { LAB_ORDER_SEARCH_ROUTE } from './lab-order-search.routes';
import { LabOrderSearchContainerComponent } from './lab-order-search-container.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(LAB_ORDER_SEARCH_ROUTE)
  ],
  declarations: [ LabOrderSearchContainerComponent, LabOrderSearchComponent ],
  providers: [  ],
  exports: [ RouterModule, FormsModule, ReactiveFormsModule ]
})
export class LabOrderSearchModule {}
