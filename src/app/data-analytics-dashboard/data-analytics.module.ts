import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    Angulartics2Module.forChild()
  ],
  declarations: [],
  providers: [],
  exports: []
})
export class DataAnalyticsModule {}
