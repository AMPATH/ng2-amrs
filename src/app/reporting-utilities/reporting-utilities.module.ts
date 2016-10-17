import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {
  InputTextModule, AccordionModule, SliderModule, PanelModule, MenuModule, MessagesModule,
  GrowlModule, InputTextareaModule, DropdownModule, ButtonModule, MultiSelectModule, CalendarModule
} from 'primeng/primeng';
import {ReportFilterComponent} from './report-filter/report-filter.component';
import {EtlDataService} from './report-filter/etl-data.service';
import {AmrsDataService} from './report-filter/amrs-data.service';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule, RouterModule, InputTextModule, AccordionModule, SliderModule,
    PanelModule, MenuModule, MessagesModule, GrowlModule, InputTextareaModule,
    DropdownModule, ButtonModule, FormsModule, ReactiveFormsModule, MultiSelectModule,
    CalendarModule
  ],
  declarations: [ReportFilterComponent],
  providers: [EtlDataService, AmrsDataService],
  exports: [ReportFilterComponent]
})
export class ReportingUtilities {
}
