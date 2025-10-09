import { NgModule } from '@angular/core';
import { GroupManagerModule } from '../../group-manager/group-manager.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular/main';

import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { PatientProgramEnrollmentModule } from '../../patients-program-enrollment/patients-program-enrollment.module';
import { PreAppointmentSummaryComponent } from './pre-appointment-summary/pre-appointment-summary.component';
import { PreAppointmentSummaryPatientListComponent } from './pre-appointment-outreach/pre-appointment-summary-patient-list/pre-appointment-summary-patient-list.component';
import { DataListsModule } from 'src/app/shared/data-lists/data-lists.module';
@NgModule({
  imports: [
    GroupManagerModule,
    CommonModule,
    FormsModule,
    PatientProgramEnrollmentModule,
    AgGridModule,
    DataListsModule
  ],
  exports: [ClinicLabOrdersComponent, PreAppointmentSummaryComponent],
  declarations: [
    ClinicLabOrdersComponent,
    PreAppointmentSummaryComponent,
    PreAppointmentSummaryPatientListComponent
  ],
  providers: []
})
export class GeneralModule {}
