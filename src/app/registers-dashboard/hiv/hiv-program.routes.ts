import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistersDashboardComponent } from '../registers-dashboard.component';
import { RegistersDashboardGuard } from '../registers-guard.guard';
import { DefaulterTracingRegisterComponent } from './defaulter-tracing-register/defaulter-tracing-register.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RegistersDashboardComponent,
        canActivate: [RegistersDashboardGuard],
        canDeactivate: [RegistersDashboardGuard],
        children: [
          {
            path: '',
            redirectTo: 'defaulter-tracing-register',
            pathMatch: 'full'
          },
          {
            path: 'defaulter-tracing-register',
            children: [
              {
                path: '',
                component: DefaulterTracingRegisterComponent
              }
              // {
              //   path: 'patient-list/:report/:indicator/:period',
              //   component: VisualizationPatientListComponent
              // }
            ]
          }
        ]
      }
    ]
  }
];

export const RegistersDashboardHivRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
