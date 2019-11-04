import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  InputTextModule, AccordionModule, SliderModule, PanelModule, MenuModule, MessagesModule,
  GrowlModule, InputTextareaModule, DropdownModule, ButtonModule, MultiSelectModule, CalendarModule
} from 'primeng/primeng';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { EtlApi } from '../etl-api/etl-api.module';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ReportViewComponent } from './report-view/report-view.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

export function highchartsFactory() {
  const hc = require('highcharts');
  const hcm = require('highcharts/highcharts-more');
  const hce =   require('highcharts/modules/exporting');
  hcm(hc);
  hce(hc);
  return hc;
}

@NgModule({
  imports: [
    CommonModule, RouterModule, InputTextModule, AccordionModule, NgamrsSharedModule,
    SliderModule, PanelModule, MenuModule, MessagesModule,
    GrowlModule, InputTextareaModule, DropdownModule,
    ButtonModule, FormsModule, ReactiveFormsModule, MultiSelectModule,
    CalendarModule, OpenmrsApi, EtlApi,
    ChartModule
  ],
  declarations: [ReportFilterComponent, ReportViewComponent],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
  exports: [ReportFilterComponent, ReportViewComponent]
})
export class ReportingUtilitiesModule {
}
