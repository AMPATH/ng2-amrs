import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PatientReferralContainerComponent
} from '../../referral-care-lib/patient-referral.container.component';
import { PatientReferralComponent } from './patient-referral.component';

const routes: Routes = [
  {
    path: 'patient-referral-report',
    children: [
      {
        path: '',
        component: PatientReferralComponent
      }
    ]
  },
];

export const patientReferralProgramRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
