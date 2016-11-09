import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Encounter } from './encounter.model';
import { Patient } from './patient.model';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule],
  declarations: [Encounter],
  providers: [],
  exports: []
})
export class Models { }
