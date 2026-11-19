import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistersDashboardGuard } from './registers-guard.guard';
import { RegistersDashboardComponent } from './registers-dashboard.component';
import { RegistersHivModule } from './hiv/registers-hiv.module';
export const routes: Routes = [
  {
    path: '',
    component: RegistersDashboardComponent,
    canActivate: [RegistersDashboardGuard],
    children: [
      {
        path: 'hiv',
        loadChildren: './hiv/registers-hiv.module#RegistersHivModule'
      }
    ]
  }
];

export const registersDashboardRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
