import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { authRouting } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { LoginDialogComponent } from './login-dialog.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { FormUpdaterService } from '../patient-dashboard/common/formentry/form-updater.service';
import { FormOrderMetaDataService } from '../patient-dashboard/common/forms/form-order-metadata.service';
import { FormSchemaService } from '../patient-dashboard/common/formentry/form-schema.service';
import { FormSchemaCompiler } from 'ngx-openmrs-formentry';
import { FormListService } from '../patient-dashboard/common/forms/form-list.service';

@NgModule({
  imports: [
    CommonModule,
    authRouting,
    NgamrsSharedModule
  ],
  declarations: [
    LoginComponent,
    LoginDialogComponent,
  ],
  providers: [
    FormUpdaterService,
    FormOrderMetaDataService,
    FormSchemaService,
    FormSchemaCompiler,
    FormListService
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthenticationModule { }
