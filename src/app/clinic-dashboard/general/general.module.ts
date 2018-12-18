import { NgModule } from '@angular/core';
import { GroupManagerModule } from '../../group-manager/group-manager.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular/main';


import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { PatientProgramEnrollmentModule } from '../../patients-program-enrollment/patients-program-enrollment.module';


@NgModule({
    imports: [
        GroupManagerModule,
        CommonModule,
        FormsModule,
        PatientProgramEnrollmentModule,
        AgGridModule
    ],
    exports: [
        ClinicLabOrdersComponent
    ],
    declarations: [
        ClinicLabOrdersComponent,
    ],
    providers: [
    ]
})
export class GeneralModule { }
