import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { clinicDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    clinicDashboardRouting
  ],
  declarations: [
    PatientInfoComponent
  ],
  providers: [

  ]
})
export class PatientSeacrhModule { }
