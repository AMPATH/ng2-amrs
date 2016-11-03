import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppSettingsComponent } from './app-settings.component';
import { RouterModule } from '@angular/router';
import { APP_SETTINGS_ROUTES } from './app-settings.routes';
import { UtilsModule } from '../utils/utils.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AppSettingsService } from './app-settings.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2Bs3ModalModule,
    UtilsModule,
    RouterModule.forChild(APP_SETTINGS_ROUTES)
  ],
  declarations: [AppSettingsComponent],
  providers: [
    AppSettingsService
  ],
  exports: [
    RouterModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppSettingsModule {}
