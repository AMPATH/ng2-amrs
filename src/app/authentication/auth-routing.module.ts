import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { LoginGuard } from '../shared/guards/login.guard';

const authRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoginGuard]
  }
];

export const authRouting: ModuleWithProviders = RouterModule.forChild(
  authRoutes
);
