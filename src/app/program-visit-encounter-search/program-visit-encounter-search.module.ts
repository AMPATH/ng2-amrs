import { ProgramVisitEncounterSearchComponent } from './program-visit-encounter-search.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        AngularMultiSelectModule
    ],
    exports: [ProgramVisitEncounterSearchComponent],
    declarations: [ProgramVisitEncounterSearchComponent],
    providers: [],
})
export class ProgramVisitEncounterSearchModule { }
