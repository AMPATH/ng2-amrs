import { ProgramVisitEncounterSearchComponent } from './program-visit-encounter-search.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { SelectDepartmentService } from './../shared/services/select-department.service';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { MatTabsModule } from '@angular/material/tabs';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        AngularMultiSelectModule,
        DateTimePickerModule,
        MatTabsModule
    ],
    exports: [ProgramVisitEncounterSearchComponent],
    declarations: [ProgramVisitEncounterSearchComponent],
    providers: [DepartmentProgramsConfigService, DataCacheService, SelectDepartmentService],
})
export class ProgramVisitEncounterSearchModule { }
