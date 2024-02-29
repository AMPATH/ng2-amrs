import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaulterTracingRegisterComponent } from './defaulter-tracing-register/defaulter-tracing-register.component';
import { DefaulterPatientListComponent } from './defaulter-tracing-register/defaulter-patient-list/defaulter-patient-list.component';

const routes: Routes = [
  {
    path: 'defaulter-tracing-register',
    children: [
      {
        path: '',
        component: DefaulterTracingRegisterComponent
      },
      {
        path: 'defaulter-tracing-register-patient-list',
        component: DefaulterPatientListComponent
      }
    ]
  }
];

export const registersDashboardHivRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
