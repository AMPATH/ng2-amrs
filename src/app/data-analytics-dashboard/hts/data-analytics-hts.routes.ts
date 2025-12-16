import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataEntryStatisticsComponent } from '../../data-entry-statistics/data-entry-statistics.component';
import { DataEntryStatisticsPatientListComponent } from '../../data-entry-statistics/data-entry-statistics-patient-list.component';
import { PatientsProgramEnrollmentComponent } from '../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from '../../patients-program-enrollment/program-enrollent-patient-list.component';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { AdminDashboardClinicFlowComponent } from '../hiv/clinic-flow/admin-dashboard-clinic-flow';
import { HtsrefferallinkageRegisterComponent } from './hts-registers/htsrefferallinkage-register/htsrefferallinkage-register.component';
const routes: Routes = [
  {
    path: 'clinic-flow',
    component: AdminDashboardClinicFlowComponent
  },
  {
    path: 'program-enrollment',
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
    path: 'data-entry-statistics',
    children: [
      {
        path: '',
        component: DataEntryStatisticsComponent
      },
      {
        path: 'patient-list',
        component: DataEntryStatisticsPatientListComponent
      }
    ]
  },
  { path: 'register', component: HtsrefferallinkageRegisterComponent },
  {
    path: 'select-department',
    component: ChangeDepartmentComponent
  }
];

export const dataAnalyticsDashboardHtsRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
