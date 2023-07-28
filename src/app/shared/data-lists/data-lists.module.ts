import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { GenericListComponent } from './generic-list/generic-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PreAppointmentPatientListComponent } from './pre-appointment-patient-list/pre-appointment-patient-list.component';
import { PreAppointmentExtendedListComponent } from './pre-appointment-extended-list/pre-appointment-extended-list.component';

@NgModule({
  imports: [AgGridModule.withComponents([])],
  declarations: [
    GenericListComponent,
    PatientListComponent,
    PreAppointmentPatientListComponent,
    PreAppointmentExtendedListComponent
  ],
  exports: [
    GenericListComponent,
    PatientListComponent,
    PreAppointmentPatientListComponent,
    PreAppointmentExtendedListComponent
  ]
})
export class DataListsModule {}
