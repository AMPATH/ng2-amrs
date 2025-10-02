import { NgModule } from '@angular/core';
import { FacilitySearchComponent } from './facility-search/facility-search.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';

const routes: Routes = [
  {
    path: 'search',
    component: FacilitySearchComponent,
    canActivate: []
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FacilitySearchComponent, FacilityDetailsComponent],
  providers: [LocationResourceService]
})
export class FacilityManagementModule {}
