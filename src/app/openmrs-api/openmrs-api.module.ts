import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationResourceService } from './location-resource.service';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { FormsResourceService } from './forms-resource.service';

import { EncounterResourceService } from './encounter-resource.service';
import { PatientResourceService } from './patient-resource.service';
import { PatientSearchService } from '../patient-dashboard/patient-search/patient-search.service';
import { FakeEncounterResourceService } from './patient-encounter-service.mock';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, AppSettingsModule],
  declarations: [],
  providers: [LocationResourceService,
  FormsResourceService,
  PatientResourceService,
  PatientSearchService, {
      provide: EncounterResourceService, useFactory: () => {
        return new FakeEncounterResourceService();
      }, deps: []
    }],

  exports: []
})

export class OpenmrsApi {
}
