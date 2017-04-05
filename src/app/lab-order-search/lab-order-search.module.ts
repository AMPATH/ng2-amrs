import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LabOrderSearchComponent } from './lab-order-search.component';
import { LabOrderSearchPostComponent } from './lab-order-search-post.component';
import { LabOrderSearchContainerComponent } from './lab-order-search-container.component';

import { LabOrdersSearchService } from './lab-orders-search.service';
import { LabOrdersSearchHelperService } from './lab-order-search-helper.service';
import { LabOrderPostService } from './lab-order-post.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LabOrderSearchContainerComponent,
    LabOrderSearchComponent,
    LabOrderSearchPostComponent
  ],
  providers: [
    LabOrdersSearchService,
    LabOrdersSearchHelperService,
    LabOrderPostService
  ],
  exports: [
    LabOrderSearchPostComponent
  ]
})
export class LabOrderSearchModule {}
