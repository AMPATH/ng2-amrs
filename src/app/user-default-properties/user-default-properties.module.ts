import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { USER_DEFAULT_PROPERTIES_ROUTE } from './user-default-properties.routes';
import { UtilsModule } from '../utils/utils.module';
import { UserDefaultPropertiesComponent } from './user-default-properties.component';
import { UserDefaultPropertiesService } from './user-default-properties.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UtilsModule,
    RouterModule.forChild(USER_DEFAULT_PROPERTIES_ROUTE)
  ],
  declarations: [UserDefaultPropertiesComponent],
  providers: [
    UserDefaultPropertiesService
  ],
  exports: [
    RouterModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UserDefaultPropertiesModule {}
