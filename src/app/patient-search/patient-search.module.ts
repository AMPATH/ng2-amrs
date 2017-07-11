import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Ng2PaginationModule } from 'ng2-pagination';

import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';

import { PatientSearchComponent } from './patient-search.component';
import { PatientSearchService } from './patient-search.service';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';

@NgModule({
    imports: [
        OpenmrsApi,
        FormsModule,
        CommonModule,
        Ng2PaginationModule
    ],
    exports: [PatientSearchComponent],
    declarations: [PatientSearchComponent],
    providers: [PatientSearchService, AppFeatureAnalytics],
})
export class PatientSearchModule { }
