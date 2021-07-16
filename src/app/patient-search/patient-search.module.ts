import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NgxPaginationModule } from "ngx-pagination";

import { OpenmrsApi } from "../openmrs-api/openmrs-api.module";

import { PatientSearchComponent } from "./patient-search.component";
import { PatientSearchContainerComponent } from "./patient-search-container.component";
import { PatientSearchService } from "./patient-search.service";
import { AppFeatureAnalytics } from "../shared/app-analytics/app-feature-analytics.service";
import { PatientRegistrationModule } from "../patient-creation/patient-creation.module";
@NgModule({
  imports: [
    OpenmrsApi,
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    PatientRegistrationModule,
    RouterModule,
  ],
  exports: [PatientSearchComponent],
  declarations: [PatientSearchComponent, PatientSearchContainerComponent],
  providers: [PatientSearchService, AppFeatureAnalytics],
})
export class PatientSearchModule {}
