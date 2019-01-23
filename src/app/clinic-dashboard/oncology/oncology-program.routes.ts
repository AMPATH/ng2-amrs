import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OncDailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { OncMonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleVisitsComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-visits.component';
import {
  DailyScheduleAppointmentsComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-not-returned.component';
import { DailyScheduleClinicFlowComponent
} from './clinic-flow/daily-schedule-clinic-flow.component';
import { ClinicFlowVisitsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-visits.component';
import {
  ClinicFlowLocationStatsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-location-stats.component';
import {
  ClinicFlowProviderStatsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-provider-stats.component';
import { ClinicFlowSummaryComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-summary.component';
import { DepartmentSelectComponent } from '../department-select/department-select.component';
import { PatientsProgramEnrollmentComponent } from '../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from '../../patients-program-enrollment/program-enrollent-patient-list.component';
import { ClinicLabOrdersComponent } from '../general/clinic-lab-orders/clinic-lab-orders.component';
const routes: Routes = [
  {
    path: 'daily-schedule',
    component: OncDailyScheduleComponent,
    children: [
        { path: '', redirectTo: 'daily-appointments', pathMatch: 'prefix' },
        { path: 'daily-visits', component: DailyScheduleVisitsComponent },
        { path: 'daily-appointments', component: DailyScheduleAppointmentsComponent },
        { path: 'daily-not-returned', component: DailyScheduleNotReturnedComponent },
        {
          path: 'clinic-flow', component: DailyScheduleClinicFlowComponent,
          children: [
            { path: 'visits', component: ClinicFlowVisitsComponent },
            { path: 'summary', component: ClinicFlowSummaryComponent },
            { path: 'provider-stats', component: ClinicFlowProviderStatsComponent },
            { path: 'location', component: ClinicFlowLocationStatsComponent },
            { path: '', redirectTo: 'summary', pathMatch: 'prefix' }
          ]
        }
      ]
},
{
    path: 'monthly-schedule',
    component: OncMonthlyScheduleComponent
},
{ path: 'program-enrollment',
 children: [
  {
      path: '',
      component: PatientsProgramEnrollmentComponent
  },
  {
      path: 'patient-list',
      component: ProgramEnrollmentPatientListComponent
  }
]
},
{
  path: 'department-select',
  component : DepartmentSelectComponent
}
];

export const oncologyProgramRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
