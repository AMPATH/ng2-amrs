import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaulterTracingRegisterComponent } from './defaulter-tracing-register/defaulter-tracing-register.component';

const routes: Routes = [
  {
    path: 'defaulter-tracing-register',
    children: [
      {
        path: '',
        component: DefaulterTracingRegisterComponent
      }
      // {
      //   path: 'patient-list',
      //   component: ''
      // }
    ]
  }
];

export const registersDashboardHivRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
