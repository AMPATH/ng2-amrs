import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PatientReferralContainerComponent
} from '../../referral-care-lib/patient-referral.container.component';
import { DataAnalyticsDashboardComponent } from '../data-analytics.component';
import { DataAnalyticsDashboardGuard } from '../data-analytics-guard';

const routes: Routes = [
  {
  path: '',
  children: [
    {
      path: '', component: DataAnalyticsDashboardComponent,
      canActivate: [
        DataAnalyticsDashboardGuard
      ],
      canDeactivate: [
        DataAnalyticsDashboardGuard
      ],
      children: [
        {
          path: 'referral',
          component: PatientReferralContainerComponent
        },
      ]
    }
    ]
  }
];

export const analyticsPatientReferralProgramRouting: ModuleWithProviders =
  RouterModule.forChild(routes);

