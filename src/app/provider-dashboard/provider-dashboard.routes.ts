import { Routes, RouterModule } from '@angular/router';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { ReferralTsComponent } from '../referral-module/components/provider-referral.component';
import { ModuleWithProviders } from '@angular/core';
import { ProviderDashboardGuard } from './provider-dashboard.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      ProviderDashboardGuard
    ],
    canDeactivate: [
      ProviderDashboardGuard
    ],
    children: [
      { path: '', redirectTo: 'referrals', pathMatch: 'full' },
      {
        path: 'referrals', component: ProviderDashboardComponent
      },
      {
        path: 'patient-list', component: ReferralTsComponent
      }
    ]
  }
];
