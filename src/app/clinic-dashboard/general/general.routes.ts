import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralModuleComponent } from './general.component';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { PatientsProgramEnrollmentComponent } from
'../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from
'../../patients-program-enrollment/program-enrollent-patient-list.component';
import {
    GeneralDailyScheduleComponent
} from './daily-schedule/daily-schedule.component';
import {
    GeneralMonthlyScheduleComponent
} from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleVisitsComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from '../../clinic-schedule-lib/daily-schedule/daily-schedule-appointments.component';
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
const routes: Routes = [
    {
        path: 'defaulter-list',
        component: DefaulterListComponent
    },
    {
        path: 'clinic-lab-orders',
        component: ClinicLabOrdersComponent
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
        path: 'daily-schedule',
        component: GeneralDailyScheduleComponent,
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
        component: GeneralMonthlyScheduleComponent
    },
    {
        path: 'referral',
        loadChildren: '../referral/patient-referral-program.module#PatientReferralProgramModule'
    },
    {
        path: 'group-manager',
        loadChildren: '../../group-manager/group-manager.module#GroupManagerModule'
    }
];

export const clinincDashboardGeneralRouting: ModuleWithProviders =
RouterModule.forChild(routes);
