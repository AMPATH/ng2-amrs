import { ProgramVisitEncounterSearchComponent } from './program-visit-encounter-search.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'angular2-select';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        SelectModule
    ],
    exports: [ProgramVisitEncounterSearchComponent],
    declarations: [ProgramVisitEncounterSearchComponent],
    providers: [],
})
export class ProgramVisitEncounterSearchModule { }
