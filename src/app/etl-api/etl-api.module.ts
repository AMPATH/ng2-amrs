import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { IndicatorResourceService } from './indicator-resource.service';
import { PatientReminderResourceService } from './patient-reminder-resource.service';

@NgModule({
  imports: [CommonModule, AppSettingsModule],
  declarations: [],
  providers: [IndicatorResourceService, PatientReminderResourceService],
  exports: []
})
export class EtlApi {
}
