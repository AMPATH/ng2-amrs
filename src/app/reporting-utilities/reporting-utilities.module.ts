import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  InputTextModule, AccordionModule, SliderModule, PanelModule, MenuModule, MessagesModule,
  GrowlModule, InputTextareaModule, DropdownModule, ButtonModule, MultiSelectModule, CalendarModule
} from 'primeng/primeng';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { EtlApi } from '../etl-api/etl-api.module';
import { ReportFilterComponent } from './report-filter/report-filter.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule, RouterModule, InputTextModule, AccordionModule,
    SliderModule, PanelModule, MenuModule, MessagesModule,
    GrowlModule, InputTextareaModule, DropdownModule,
    ButtonModule, FormsModule, ReactiveFormsModule, MultiSelectModule,
    CalendarModule, OpenmrsApi, EtlApi],
  declarations: [ReportFilterComponent],
  providers: [],
  exports: [ReportFilterComponent]
})
export class ReportingUtilities {
}
