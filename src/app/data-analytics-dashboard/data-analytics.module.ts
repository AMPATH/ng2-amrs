import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [],
  exports: []
})
export class DataAnalytics { }
