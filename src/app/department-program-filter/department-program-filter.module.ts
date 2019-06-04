import { DepartmentProgramFilterComponent } from './department-program-filter.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        AngularMultiSelectModule,
        DateTimePickerModule
    ],
    exports: [DepartmentProgramFilterComponent],
    declarations: [DepartmentProgramFilterComponent],
    providers: [DepartmentProgramsConfigService, DataCacheService],
})
export class DepartmentProgramFilterModule { }
