import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { patientDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    patientDashboardRouting
  ],
  declarations: [
    PatientInfoComponent,
    PatientEncountersComponent
  ],
  providers: [

  ]
})
export class PatientDashboardModule { }
