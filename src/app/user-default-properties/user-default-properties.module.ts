import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material';

import { USER_DEFAULT_PROPERTIES_ROUTE } from './user-default-properties.routes';
import { UtilsModule } from '../utils/utils.module';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import { UserDefaultPropertiesComponent } from './user-default-properties.component';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { RetrospectiveDataEntryModule } from '../retrospective-data-entry/retrospective-data-entry.module';

@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    UtilsModule,
    NgBusyModule,
    RetrospectiveDataEntryModule,
    RouterModule.forChild(USER_DEFAULT_PROPERTIES_ROUTE)
  ],
  declarations: [UserDefaultPropertiesComponent],
  providers: [UserDefaultPropertiesService, DepartmentProgramsConfigService],
  exports: [RouterModule, NgBusyModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserDefaultPropertiesModule {}
