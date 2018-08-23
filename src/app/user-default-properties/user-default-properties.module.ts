import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { USER_DEFAULT_PROPERTIES_ROUTE } from './user-default-properties.routes';
import { UtilsModule } from '../utils/utils.module';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { UserDefaultPropertiesComponent } from './user-default-properties.component';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { RetrospectiveDataEntryModule
} from '../retrospective-data-entry/retrospective-data-entry.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UtilsModule,
    BusyModule.forRoot(
      {
        message: 'Please Wait...',
        backdrop: false,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',
        template: `
                      <div class="loader" ><span><i class="fa fa-spinner fa-spin">
      </i>{{message}}</span></div>`,
      }
    ),
    RetrospectiveDataEntryModule,
    RouterModule.forChild(USER_DEFAULT_PROPERTIES_ROUTE)
  ],
  declarations: [UserDefaultPropertiesComponent],
  providers: [
    UserDefaultPropertiesService,
    DepartmentProgramsConfigService
  ],
  exports: [
    RouterModule,
    BusyModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UserDefaultPropertiesModule {}
