import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationResourceService } from './location-resource.service';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { FormsResourceService } from './forms-resource.service';
import {PatientSearchService} from '../patient-dashboard/patient-search/patient-search.service';
import {PatientResourceService} from './patient-resource.service';

@NgModule({
  imports: [CommonModule, AppSettingsModule],
  declarations: [],
  providers: [LocationResourceService, FormsResourceService, PatientResourceService,PatientSearchService],
  exports: []
})

export class AmrsApi { }
