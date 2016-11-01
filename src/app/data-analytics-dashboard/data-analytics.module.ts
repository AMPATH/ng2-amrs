import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FakeEncounterResourceService } from './patient-encounter-service.mock';
import { EncounterResourceService } from './encounter-resource.service';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [    {
      provide: EncounterResourceService, useFactory: () => {
        return new FakeEncounterResourceService();
      }, deps: []
    }],
  exports: []
})
export class DataAnalytics { }
